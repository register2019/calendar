<template>
  <table class="dc-table">
    <thead>
      <tr>
        <th v-for="item in tableHeader" :key="item">{{ item }}</th>
      </tr>
    </thead>
    <tbody v-for="(list, index) in props.tds" :key="index">
      <td
        v-for="(td, index) in list"
        :key="index"
        :class="[tdStyle, selectedDateBgUI(td)]"
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
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  getTodayTimeStamp,
  IDate,
  primaryColor,
  tableHeader,
  secondaryColor,
  bgColor,
  whiteColor,
  getTimeUtils,
  dateToTimeStamp,
} from "../../../utils";

type Props = {
  tds: IDate[][];
  selectedDateList?: number[];
  isSelectedFinish?: boolean;
  panelType?: string;
};

const props = withDefaults(defineProps<Props>(), {
  selectedDateList: (): number[] => [],
  panelType: "DateTimePicker",
});
const emit = defineEmits(["emitSelectedDate"]);
const tdStyle = "dc-table-tbody-td";

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
  } = getTimeUtils(props.selectedDateList[0]);
  const {
    year: endYear,
    month: endMonth,
    day: endDay,
  } = getTimeUtils(
    props.selectedDateList[1] === undefined
      ? props.selectedDateList[0]
      : props.selectedDateList[1]
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

const selectFinish = ref(false);
/**
 * 解决在一个面板中完成了日期选择 另一个面板没有选中 当移入另一个时出现选中的情况
 */
watch(
  () => props.isSelectedFinish,
  (val) => {
    if (val) {
      selectFinish.value = val;
    }
  },
  {
    immediate: true,
  }
);
const dynamicSelection = (td: IDate) => {
  if (props.selectedDateList.length === 1) {
    selectFinish.value = false;
  }
  if (props.selectedDateList.length >= 1 && !selectFinish.value) {
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
    props.panelType === "DateTime"
  ) {
    return "dc-table-selected-date-time";
  }
};

const selectedDate = (td: IDate) => {
  if (props.selectedDateList.length === 2) {
    selectFinish.value = true;
  }
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
  }
  &-tbody-td:hover {
    color: v-bind(primaryColor);
  }
  &-today {
    color: v-bind(primaryColor);
    font-weight: 700;
  }
  &-isNotCurMonth {
    color: v-bind(secondaryColor);
  }
  &-selected-td {
    background-color: v-bind(bgColor);
    &-boundary {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      background-color: v-bind(primaryColor);
      border-radius: 50%;
      color: v-bind(whiteColor);
    }
  }
  &-selected-date-time {
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
    display: inline-block;
    background-color: v-bind(primaryColor);
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
</style>
