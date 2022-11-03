<template>
  <table class="dc-table">
    <thead>
      <tr>
        <th v-for="item in tableHeader" :key="item">{{ item }}</th>
      </tr>
    </thead>
    <tbody class="dc-table-tbody">
      <tr v-for="(list, index) in tableTds" :key="index">
        <td
          v-for="(td, index) in list"
          :key="index"
          :class="[tdStyle, selectedDateBgUI(td), disabledTdUi(td)]"
          @click="selectedDate(td)"
        >
          <div @mouseenter="dynamicSelection(td)">
            <span
              :class="[
                todayUI(td.timestamp),
                beforeAndAfterUI(td.category),
                selectedStartAndEndUI(td),
                dateTimeTypeUI(td),
              ]"
              >{{ td.value }}</span
            >
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, useAttrs, watch } from "vue";
import {
  getTodayTimeStamp,
  IDate,
  tableHeader,
  getTimeUtils,
  dateToTimeStamp,
} from "../../../utils";
import { Attrs, SelectedDateList } from "../constants";

type Props = {
  tds: IDate[];
  selectedDateList?: SelectedDateList[];
  type?: string;
  currDateTime?: string; // 当且仅当类型为DateTime是使用
};

const props = withDefaults(defineProps<Props>(), {
  selectedDateList: (): SelectedDateList[] => [],
  type: "DateTimePicker",
});
const emit = defineEmits(["emitSelectedDate"]);
const tdStyle = "dc-table-tbody-td";
const attrs = useAttrs() as Attrs;

const tableTds = ref<IDate[][]>([]);
const initTableData = (tds: IDate[]) => {
  for (let i = 0; i < 6; i++) {
    tableTds.value[i] = [];
  }
  let i = 0;

  tds.forEach((td, index) => {
    if ((index + 1) % 7 === 0) {
      tableTds.value[i].push(td);
      i++;
    } else {
      tableTds.value[i].push(td);
    }
  });
};

watch(
  () => props.tds,
  (val) => {
    initTableData(val);
  },
  {
    immediate: true,
  }
);

const disabledTdUi = (td: IDate) => {
  const { range, type } = attrs.disabledDate;
  if (type === "after") {
    if (typeof range === "string" && td.timestamp >= dateToTimeStamp(range)) {
      return "disabled";
    }
  } else if (type === "before") {
    if (typeof range === "string" && td.timestamp <= dateToTimeStamp(range)) {
      return "disabled";
    }
  } else if (type === "today") {
    if (typeof range === "string" && td.timestamp === dateToTimeStamp(range)) {
      return "disabled";
    }
  } else if (
    type === "range" &&
    range instanceof Array &&
    td.timestamp >= dateToTimeStamp(range[0]) &&
    td.timestamp <= dateToTimeStamp(range[1])
  ) {
    return "disabled";
  }
};

/**
 * 日历面板中与今天对应日期的UI
 * @param val
 */
const todayUI = (val: number) => {
  if (val === getTodayTimeStamp()) {
    return "dc-table-today";
  }
  return "";
};
/**
 * 日历面板中上月和下月的UI
 * @param category
 */
const beforeAndAfterUI = (category: string) => {
  if (category !== "curr") {
    return "dc-table-isNotCurMonth";
  }
  return "";
};

const initPropsSelectedDateList = () => {
  const {
    year: startYear,
    month: startMonth,
    day: startDay,
  } = getTimeUtils(props.selectedDateList[0].val);
  const {
    year: endYear,
    month: endMonth,
    day: endDay,
  } = getTimeUtils(
    props.selectedDateList.length === 1
      ? props.selectedDateList[0].val
      : props.selectedDateList[1].val
  );

  const startDateTime = dateToTimeStamp(
    startYear + "-" + startMonth + "-" + startDay + " " + "00:00:00"
  );
  const endDateTime = dateToTimeStamp(
    endYear + "-" + endMonth + "-" + endDay + " " + "00:00:00"
  );

  return [startDateTime, endDateTime];
};

/**
 * 设置选中范围的背景颜色
 * @param td
 */
const selectedDateBgUI = (td: IDate) => {
  if (props.selectedDateList.length === 0) return;
  if (td.category === "curr") {
    const sortSelectedDateList = initPropsSelectedDateList();
    sortSelectedDateList.sort((a, b) => a - b);
    if (
      (props.selectedDateList.length === 2 &&
        sortSelectedDateList[0] === td.timestamp &&
        sortSelectedDateList[1] === td.timestamp) ||
      (props.selectedDateList.length === 1 &&
        sortSelectedDateList[0] === td.timestamp)
    ) {
      return "dc-table-selected-td start end";
    }

    if (sortSelectedDateList[0] === td.timestamp) {
      return "dc-table-selected-td start";
    }
    if (sortSelectedDateList[1] === td.timestamp) {
      return "dc-table-selected-td end";
    }

    if (
      sortSelectedDateList[0] < td.timestamp &&
      sortSelectedDateList[1] > td.timestamp
    ) {
      return "dc-table-selected-td";
    }
  }
  return "";
};
const selectedStartAndEndUI = (td: IDate) => {
  if (props.selectedDateList.length === 0) return;
  if (
    td.category === "curr" &&
    (initPropsSelectedDateList()[0] === td.timestamp ||
      initPropsSelectedDateList()[1] === td.timestamp)
  ) {
    return "dc-table-selected-td-boundary";
  }
};

const optional = (timestamp: number) => {
  const { range, type } = attrs.disabledDate;
  if (
    (type === "after" && timestamp >= dateToTimeStamp(range as string)) ||
    (type === "before" && timestamp <= dateToTimeStamp(range as string)) ||
    (type === "today" && timestamp === dateToTimeStamp(range as string)) ||
    (type === "range" &&
      timestamp >= dateToTimeStamp(range[0]) &&
      timestamp <= dateToTimeStamp(range[1]))
  ) {
    return false;
  } else {
    return true;
  }
};

const dynamicSelection = (td: IDate) => {
  if (!optional(td.timestamp)) return;
  if (
    props.selectedDateList.length === 2 &&
    props.selectedDateList[0].category === "click" &&
    props.selectedDateList[1].category === "click"
  )
    return;

  if (props.selectedDateList.length >= 1) {
    emit("emitSelectedDate", td, "mouse");
  }
};

/**
 * 处理类型为DateTime的样式
 */
const currSelectedDateTime = ref<number>();
const dateTimeTypeUI = (td: IDate) => {
  if (
    td.category === "curr" &&
    td.timestamp === currSelectedDateTime.value &&
    (props.type === "DateTime" || props.type === "Date")
  ) {
    return "dc-table-selected-date-time";
  }
};

watch(
  () => props.currDateTime,
  (val) => {
    currSelectedDateTime.value = dateToTimeStamp(val + " " + "00:00:00");
  },
  {
    immediate: true,
  }
);

const selectedDate = (td: IDate) => {
  if (!optional(td.timestamp)) return;

  currSelectedDateTime.value = td.timestamp;
  emit("emitSelectedDate", td, "click");
};
</script>

<style lang="scss" scoped>
.dc-table {
  min-width: 291px;
  border-spacing: 0 10px !important;
  &-tbody-td {
    text-align: center;
    cursor: pointer;
    height: 38px;
    width: 38px;
    font-size: 12px;
    user-select: none;
  }
  &-tbody-td:hover {
    color: var(--primary-color);
  }
  &-today {
    color: var(--primary-color);
    font-weight: 700;
  }
  &-isNotCurMonth {
    color: var(--secondary-color);
  }
  &-selected-td {
    background-color: var(--bg-color);
    &-boundary {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      background-color: var(--primary-color);
      border-radius: 50%;
      color: var(--white-color);
    }
  }
  &-selected-date-time {
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    display: inline-block;
    background-color: var(--primary-color);
    color: #fff;
  }
}
.start {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}
.end {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.disabled {
  padding: 0;
}
.disabled div {
  background-color: #f5f7fa;
  opacity: 1;
  cursor: not-allowed;
  color: #c0c4cc;
  height: 30px;
  line-height: 30px;
  padding: 3px;
}
</style>
