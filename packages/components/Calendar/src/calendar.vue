<template>
  <div @click="openCalendar" class="dc-calendar-input" ref="calendarInput">
    <input type="text" class="dc-input" v-model="startDateTime" />
    <span>至</span>
    <input type="text" class="dc-input" v-model="endDateTime" />
  </div>
  <Teleport to="body">
    <div
      class="dc-calendar"
      :style="calendarStyle"
      v-show="calendarPanel"
      ref="calendarRef"
    >
      <div class="dc-calendar-header">
        <span class="dc-calendar-header-left">
          <span>
            <DefaultInput size="small" v-model="modelLeftInput" />
          </span>
          <span>
            <DefaultTimeSelect
              v-if="timeType === 'Select'"
              size="small"
              v-model="startTimeSelect"
            />
            <DefaultTimePicker v-else size="small" v-model="startTimePicker" />
          </span>
        </span>
        <span class="dc-calendar-header-separator">&gt;</span>
        <span class="dc-calendar-header-right">
          <span>
            <DefaultInput size="small" v-model="modelRightInput" />
          </span>
          <span>
            <DefaultTimeSelect
              v-if="timeType === 'Select'"
              size="small"
              v-model="endTimeSelect"
            />
            <DefaultTimePicker v-else size="small" v-model="endTimePicker" />
          </span>
        </span>
      </div>

      <div class="dc-calendar-content">
        <div class="dc-calendar-content-left">
          <div class="dc-calendar-content-left-top">
            <div class="dc-calendar-content-left-top-icon">
              <span @click="clickBefore('year')">&lt;&lt;</span>
              <span @click="clickBefore('month')">&lt;</span>
            </div>
            <div class="dc-calendar-content-left-top-date">
              {{ leftDate }}
            </div>
          </div>
          <div>
            <table class="dc-table">
              <thead>
                <tr>
                  <th v-for="item in tableHeader" :key="item">{{ item }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(list, index) in leftTds" :key="index">
                  <td
                    v-for="td in list"
                    :key="td"
                    :class="[
                      selectedRangeBg(td),
                      selectedDateBoundary(td, 0),
                      selectedDateBoundary(td, 1),
                      tdStyle,
                    ]"
                  >
                    <div :class="beforeAndAfterStyle(td, 'curr')">
                      <span
                        :class="[selectedDate(td)]"
                        @mouseenter="selectedRangeStyle(td)"
                        @click="selectDate(td, 'left')"
                        >{{ td.value }}</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="dc-calendar-content-right">
          <div class="dc-calendar-content-right-top">
            <div class="dc-calendar-content-right-top-date">
              {{ rightDate }}
            </div>
            <div class="dc-calendar-content-right-top-icon">
              <span @click="clickAfter('month')"> &gt; </span>
              <span @click="clickAfter('year')"> &gt;&gt; </span>
            </div>
          </div>
          <div>
            <table class="dc-table">
              <thead>
                <tr>
                  <th v-for="item in tableHeader" :key="item">{{ item }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(list, index) in rightTds" :key="index">
                  <td
                    v-for="td in list"
                    :key="td"
                    :class="[
                      selectedRangeBg(td),
                      selectedDateBoundary(td, 0),
                      selectedDateBoundary(td, 1),
                      tdStyle,
                    ]"
                  >
                    <div>
                      <span
                        :class="[beforeAndAfterStyle(td), selectedDate(td)]"
                        @mouseenter="selectedRangeStyle(td)"
                        @click="selectDate(td, 'right')"
                        >{{ td.value }}</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="dc-calendar-footer">
        <button @click="cancelBtn">取消</button>
        <button @click="submitBtn">确定</button>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DefaultCalendar",
};
</script>
<script lang="ts" setup>
import { ref, watch, computed, CSSProperties } from "vue";
import { onClickOutside, useElementBounding } from "@vueuse/core";
import {
  tableHeader,
  getCurrAdjacentMonth,
  timeFormat,
  unlinkBefore,
  unlinkAfter,
  getCurrPageDays,
  IDate,
  dateFormat,
  clickPrevOrNext,
  dateTimeFormat,
  initCalendarPanel,
  dateToTimeStamp,
  determineTheDateFormat,
  updatePanelDate,
  formatPanelDate,
  getTimeUtils,
} from "../../../utils";
import DefaultTimePicker from "../../TimePicker/src/time-picker.vue";
import DefaultInput from "../../Input/src/input.vue";
import DefaultTimeSelect from "../../TimeSelect/src/time-select.vue";
import { log } from "console";

const tdStyle = "dc-td";

const calendarPanel = ref(false);
const calendarRef = ref();

const startDateTime = ref<string>();
const endDateTime = ref<string>();
const startTimePicker = ref<string>();
const endTimePicker = ref<string>();
const startTimeSelect = ref<string>();
const endTimeSelect = ref<string>();

const selectedDateList = ref<number[]>([1661090509502, 1661090509502]);

const calendarInput = ref(null);
const calendarStyle = ref<CSSProperties>({
  position: "absolute",
  top: "",
  left: "",
});

onClickOutside(calendarRef, () => {
  calendarPanel.value = false;
  isSelectedDateRange.value = false;
});

type Props = {
  unlinkPanels?: boolean; // 是否取消左右日期间的联动 默认是联动的
  modelValue?: Date[];
  timeType?: string; // 默认是Picker 可选值为Picker和Select
};
const { unlinkPanels, timeType, modelValue } = withDefaults(
  defineProps<Props>(),
  {
    unlinkPanels: false,
    modelValue: (): Date[] => [],
    timeType: "Picker",
  }
);
const emit = defineEmits(["update:modelValue", "onClick"]);

let leftDateYear = ref(0);
let leftDateMonth = ref(0);
let rightDateYear = ref(0);
let rightDateMonth = ref(0);

let leftTds = ref<any[][]>([]);
let rightTds = ref<any[][]>([]);

let unlinkLeft = ref(false);
let unlinkRight = ref(false);

let modelLeftInput = ref();
let modelRightInput = ref();

let isCompleteSelection = ref(false);

let selectedDateTimeRange = ref<SelectedDateTimeRange[]>([]);

if (modelValue.length !== 0) {
  // 有默认时间
  startDateTime.value = dateTimeFormat(modelValue[0]);
  endDateTime.value = dateTimeFormat(modelValue[1]);
  const {
    leftYear,
    leftMonth,
    leftHour,
    leftMinu,
    leftSeco,
    rightYear,
    rightMonth,
    rightHour,
    rightMinu,
    rightSeco,
  } = initCalendarPanel(modelValue);
  leftDateYear.value = leftYear;
  leftDateMonth.value = Number(leftMonth);
  rightDateYear.value = rightYear;
  rightDateMonth.value = Number(rightMonth);

  // 初始化日期
  updateDateTime([
    dateToTimeStamp(modelValue[0]),
    dateToTimeStamp(modelValue[1]),
  ]);

  // 初始化时间
  startTimePicker.value = leftHour + ":" + leftMinu + ":" + leftSeco;
  endTimePicker.value = rightHour + ":" + rightMinu + ":" + rightSeco;

  selectedDateTimeRange.value = [
    {
      val: dateToTimeStamp(modelValue[0]),
      isInit: true,
    },
    {
      val: dateToTimeStamp(modelValue[1]),
      isInit: true,
    },
  ];
} else {
  // 没有默认时间
  const { leftYear, leftMonth, rightYear, rightMonth } = getCurrAdjacentMonth();
  leftDateYear.value = leftYear;
  leftDateMonth.value = leftMonth;
  rightDateYear.value = rightYear;
  rightDateMonth.value = rightMonth;
}

const clickAfter = (category: string) => {
  unlinkRight.value = true;
  if (unlinkLeft.value) {
    unlinkLeft.value = false;
  }
  if (category === "month") {
    rightDateMonth.value++;
    if (unlinkPanels) {
      const { month, year } = unlinkAfter(
        rightDateMonth.value,
        rightDateYear.value
      );
      rightDateMonth.value = month;
      rightDateYear.value = year;
    } else {
      leftDateMonth.value++;
      const { month: rightMonth, year: rightYear } = unlinkAfter(
        rightDateMonth.value,
        rightDateYear.value
      );
      rightDateMonth.value = rightMonth;
      rightDateYear.value = rightYear;
      const { month: leftMonth, year: leftYear } = unlinkAfter(
        leftDateMonth.value,
        leftDateYear.value
      );
      leftDateMonth.value = leftMonth;
      leftDateYear.value = leftYear;
    }
  } else if (category === "year") {
    rightDateYear.value++;
    if (!unlinkPanels) {
      leftDateYear.value++;
    }
  }
  initArr("default", "default");
};

const clickBefore = (category: string) => {
  unlinkLeft.value = true;
  if (unlinkRight.value) {
    unlinkRight.value = false;
  }
  if (category === "month") {
    leftDateMonth.value--;
    if (unlinkPanels) {
      const { month, year } = unlinkBefore(
        leftDateMonth.value,
        leftDateYear.value
      );
      leftDateMonth.value = month;
      leftDateYear.value = year;
    } else {
      rightDateMonth.value--;
      const { month: leftMonth, year: leftYear } = unlinkBefore(
        leftDateMonth.value,
        leftDateYear.value
      );
      leftDateYear.value = leftYear;
      leftDateMonth.value = leftMonth;
      const { month: rightMonth, year: rightYear } = unlinkBefore(
        rightDateMonth.value,
        rightDateYear.value
      );
      rightDateYear.value = rightYear;
      rightDateMonth.value = rightMonth;
    }
  } else if (category === "year") {
    leftDateYear.value--;
    if (!unlinkPanels) {
      rightDateYear.value--;
    }
  }
  initArr("default", "default");
};

type SelectedDateTimeRange = {
  val: number;
  isInit: boolean;
};

const selectDate = (td: IDate, category: string) => {
  let year = category === "left" ? leftDateYear.value : rightDateYear.value;
  console.log(startTimePicker.value, endTimePicker.value);

  if (
    typeof startTimePicker.value === "undefined" &&
    typeof endTimePicker.value === "undefined"
  ) {
    startTimePicker.value = "00:00:00";
    endTimePicker.value = "00:00:00";
  }

  let month = timeFormat(
    category === "left" ? leftDateMonth.value : rightDateMonth.value
  );

  let day = timeFormat(td.value);
  const { month: currMonth, year: currYear } = clickPrevOrNext(
    td,
    year,
    Number(month)
  );

  const timeStamp = new Date(currYear + "-" + currMonth + "-" + day).getTime();
  if (selectedDateList.value.length > 2) {
    selectedDateList.value = [];
    selectedDateList.value?.push(timeStamp);
  } else {
    if (selectedDateList.value.length === 0) {
      selectedDateList.value?.push(timeStamp);
    } else {
      if (selectedDateList.value.length < 2) {
        if (timeStamp >= selectedDateList.value[0]) {
          selectedDateList.value?.push(timeStamp);
          modelRightInput.value = dateFormat(timeStamp);
        } else {
          selectedDateList.value?.unshift(timeStamp);
          modelLeftInput.value = dateFormat(timeStamp);
        }
      } else {
        selectedDateList.value = [];
        selectedDateList.value?.push(timeStamp);
        modelLeftInput.value = dateFormat(timeStamp);
        modelRightInput.value = dateFormat(timeStamp);
      }
    }
  }
  selectedRange(td);
};

// 是否是点击日历面板选择日期 主要用于区别输入框修改日期 日历面板更新的情况
const isSelectedDateRange = ref(false);
const selectedRange = (td: IDate) => {
  isSelectedDateRange.value = true;

  // 记录存储的开始时间和结束时间
  if (selectedDateTimeRange.value.length === 0) {
    selectedDateTimeRange.value.push({ val: td.timestamp, isInit: true });
  } else if (selectedDateTimeRange.value.length === 2) {
    isCompleteSelection.value = true;
    const findIsInitIsAllTrue = selectedDateTimeRange.value.find(
      (item) => item.isInit === false
    );

    if (findIsInitIsAllTrue === undefined) {
      selectedDateTimeRange.value = [];
      selectedDateTimeRange.value.push({
        isInit: true,
        val: td.timestamp,
      });
      isCompleteSelection.value = false;
    }

    if (selectedDateTimeRange.value.length === 2) {
      selectedDateTimeRange.value = selectedDateTimeRange.value.map((item) => {
        if (item.isInit) {
          return item;
        } else {
          item.isInit = true;
          return item;
        }
      });
    }
  }
};

/**
 * 更新面板日期
 */
function updateDateTime(dateList: number[]) {
  modelLeftInput.value = dateFormat(dateList[0]);
  modelRightInput.value = dateFormat(dateList[1]);
}

const openCalendar = () => {
  const {
    top: inputTop,
    left: inputLeft,
    height: inputHeight,
    bottom: inputBottom,
  } = useElementBounding(calendarInput);
  const { height: panelHeight } = useElementBounding(calendarRef);
  if (inputBottom.value > panelHeight.value) {
    calendarStyle.value.top = inputTop.value + inputHeight.value + 10 + "px";
  } else {
    calendarStyle.value.top = inputTop.value - panelHeight.value - 10 + "px";
  }
  calendarStyle.value.left = inputLeft.value + "px";

  calendarPanel.value = true;
};
for (let i = 0; i < 6; i++) {
  leftTds.value[i] = [];
  rightTds.value[i] = [];
}
const initArr = (initLeft: string, initRight: string) => {
  for (let i = 0; i < 6; i++) {
    if (!unlinkPanels) {
      if (initLeft === "left") {
        rightTds.value[i] = [];
      }
      if (initRight === "right") {
        leftTds.value[i] = [];
      }

      if (initLeft === "default" && initRight === "default") {
        leftTds.value[i] = [];
        rightTds.value[i] = [];
      }
    } else {
      if (unlinkLeft.value) {
        leftTds.value[i] = [];
      } else {
        rightTds.value[i] = [];
      }
    }
  }
};

const compareTwoDates = (val: string[]) => {
  if (dateToTimeStamp(val[0]) > dateToTimeStamp(val[1])) {
    modelLeftInput.value = val[1];
    modelRightInput.value = val[0];
    leftDateYear.value = Number(val[1].split("-")[0]);
    leftDateMonth.value = Number(val[1].split("-")[1]);
  } else {
    modelLeftInput.value = val[0];
    modelRightInput.value = val[1];
  }
};

watch([modelLeftInput, modelRightInput], (newVal, oldVal) => {
  let notInitLeft = "default";
  let notInitRight = "default";
  if (
    determineTheDateFormat(newVal[0]) &&
    determineTheDateFormat(newVal[1]) &&
    modelValue.length !== 0 &&
    !isSelectedDateRange.value
  ) {
    if (newVal[0] === oldVal[0]) {
      // 修改了右侧的日期
      if (
        newVal[1].split("-")[0] === oldVal[1].split("-")[0] &&
        newVal[1].split("-")[2] === oldVal[1].split("-")[2]
      ) {
        // 修改了右侧日期的月份
        const splitNewVal = newVal[1].split("-");
        const splitOldVal = oldVal[0].split("-");
        const { afterTheYear, afterTheMonth } = updatePanelDate({
          category: "right-month",
          updateYear: Number(splitNewVal[0]),
          updateMonth: Number(splitNewVal[1]),
        })!;
        rightDateYear.value = splitNewVal[0];
        rightDateMonth.value = splitNewVal[1];
        leftDateYear.value = afterTheYear;
        leftDateMonth.value = afterTheMonth;
        modelLeftInput.value =
          afterTheYear + "-" + timeFormat(afterTheMonth) + "-" + splitOldVal[2];
      } else if (
        newVal[1].split("-")[1] === oldVal[1].split("-")[1] &&
        newVal[1].split("-")[2] === oldVal[1].split("-")[2]
      ) {
        // 修改了右侧日期的年份
        const splitNewVal = newVal[1].split("-");
        const splitOldVal = oldVal[0].split("-");
        leftDateYear.value = splitNewVal[0];
        rightDateYear.value = splitNewVal[0];

        modelLeftInput.value =
          splitNewVal[0] + "-" + splitOldVal[1] + "-" + splitOldVal[2];
      } else {
        // 修改右侧的日期
        compareTwoDates(newVal);
        notInitRight = "left";
      }
    } else {
      // 修改了左侧的日期
      if (
        newVal[0].split("-")[0] === oldVal[0].split("-")[0] &&
        newVal[0].split("-")[2] === oldVal[0].split("-")[2]
      ) {
        // 修改了左侧日期的月份
        const splitNewVal = newVal[0].split("-");
        const splitOldVal = oldVal[1].split("-");
        const { afterTheYear, afterTheMonth } = updatePanelDate({
          category: "left-month",
          updateYear: Number(splitNewVal[0]),
          updateMonth: Number(splitNewVal[1]),
        })!;

        leftDateYear.value = splitNewVal[0];
        leftDateMonth.value = splitNewVal[1];
        rightDateYear.value = afterTheYear;
        rightDateMonth.value = afterTheMonth;

        modelRightInput.value =
          afterTheYear + "-" + timeFormat(afterTheMonth) + "-" + splitOldVal[2];
      } else if (
        newVal[0].split("-")[1] === oldVal[0].split("-")[1] &&
        newVal[0].split("-")[2] === oldVal[0].split("-")[2]
      ) {
        // 修改了左侧日期的年份
        const splitNewVal = newVal[0].split("-");
        const splitOldVal = oldVal[1].split("-");

        leftDateYear.value = splitNewVal[0];
        rightDateYear.value = splitNewVal[0];

        modelRightInput.value =
          splitNewVal[0] + "-" + splitOldVal[1] + "-" + splitOldVal[2];
      } else {
        // 修改左侧的日期
        compareTwoDates(newVal);
        notInitLeft = "right";
      }
    }
    selectedDateTimeRange.value = [
      {
        val: dateToTimeStamp(newVal[0]),
        isInit: true,
      },
      {
        val: dateToTimeStamp(newVal[1]),
        isInit: true,
      },
    ];
    initArr(notInitLeft, notInitRight);
  }
});

watch([startTimePicker, endTimePicker], (val) => {
  if (modelValue.length === 0) {
    const { year, month, day } = getTimeUtils();
    modelLeftInput.value = year + "-" + month + "-" + day;
    modelRightInput.value = year + "-" + month + "-" + day;

    if (typeof val[0] === "undefined") {
      startTimePicker.value = val[1];
    } else if (typeof val[1] === "undefined") {
      endTimePicker.value = val[0];
    }
  }
});

// 更新左侧面板 S
const updateLeftPanel = (val: number[]) => {
  let i = 0;
  getCurrPageDays(val[0], val[1]).forEach((tds, index) => {
    if ((index + 1) % 7 === 0) {
      leftTds.value[i].push(tds);
      i++;
    } else {
      leftTds.value[i].push(tds);
    }
  });
};
watch(
  [leftDateYear, leftDateMonth],
  (val) => {
    updateLeftPanel(val);
  },
  {
    immediate: true,
  }
);
// 更新右侧面板 E

// 更新右侧面板 S
const updateRightPanel = (val: number[]) => {
  let i = 0;
  getCurrPageDays(val[0], val[1]).forEach((tds, index) => {
    if ((index + 1) % 7 === 0) {
      rightTds.value[i].push(tds);
      i++;
    } else {
      rightTds.value[i].push(tds);
    }
  });
};
watch(
  [rightDateYear, rightDateMonth],
  (val) => {
    updateRightPanel(val);
  },
  {
    immediate: true,
  }
);
// 更新右侧面板 E

const leftDate = computed(() => {
  let month = formatPanelDate(leftDateMonth.value);

  return leftDateYear.value + "年" + month + "月";
});
const rightDate = computed(() => {
  let month = formatPanelDate(rightDateMonth.value);
  return rightDateYear.value + "年" + month + "月";
});

const beforeAndAfterStyle = (td: IDate, curr?: string) => {
  if (td.category === "prev" || td.category === "next") {
    return "dc-prev-and-next";
  } else {
    if (
      td.category === "curr" &&
      dateFormat(td.timestamp) === dateFormat(new Date().getTime()) &&
      curr
    ) {
      return "dc-today-style";
    }
    return "";
  }
};

const selectedRangeStyle = (td: IDate) => {
  if (
    selectedDateTimeRange.value.length === 0 ||
    isCompleteSelection.value ||
    selectedDateTimeRange.value.length === 2
  )
    return;

  if (selectedDateTimeRange.value.length === 1) {
    if (td.timestamp < selectedDateTimeRange.value[0].val) {
      selectedDateTimeRange.value.unshift({ val: td.timestamp, isInit: false });
    } else {
      selectedDateTimeRange.value.push({ val: td.timestamp, isInit: false });
    }
  } else {
    const findInitNum = selectedDateTimeRange.value.find((item) => item.isInit);
    const findInitNumIndex = selectedDateTimeRange.value.findIndex(
      (item) => item.isInit
    );

    if (findInitNumIndex === 0 && td.timestamp <= findInitNum?.val!) {
      selectedDateTimeRange.value.pop();
      selectedDateTimeRange.value.unshift({ val: td.timestamp, isInit: false });
    } else if (findInitNumIndex === 0) {
      selectedDateTimeRange.value[1].val = td.timestamp;
    }
    if (findInitNumIndex === 1 && td.timestamp >= findInitNum?.val!) {
      selectedDateTimeRange.value.shift();
      selectedDateTimeRange.value.push({ val: td.timestamp, isInit: false });
    } else if (findInitNumIndex === 1) {
      selectedDateTimeRange.value[0].val = td.timestamp;
    }
  }

  if (selectedDateTimeRange.value.length === 2) {
    if (
      selectedDateTimeRange.value[0].val <= td.timestamp &&
      td.timestamp <= selectedDateTimeRange.value[1].val
    ) {
      return "dc-selected-range-bg";
    }
  }
};

const cancelBtn = () => {
  calendarPanel.value = false;
  isSelectedDateRange.value = false;
};

const submitBtn = () => {
  const startTime =
    timeType === "Select" ? startTimeSelect.value : startTimePicker.value;
  const endTime =
    timeType === "Select" ? endTimeSelect.value : endTimePicker.value;

  startDateTime.value =
    dateFormat(selectedDateTimeRange.value[0].val) + " " + startTime;

  endDateTime.value =
    dateFormat(selectedDateTimeRange.value[1].val) + " " + endTime;
  calendarPanel.value = false;

  const emitParentComponentVal = [
    selectedDateTimeRange.value[0].val,
    selectedDateTimeRange.value[1].val,
  ];
  emit("update:modelValue", emitParentComponentVal);

  emit("onClick", emitParentComponentVal);
  isSelectedDateRange.value = false;
};

/**
 * 被选中的开始和结束之间的日期样式
 * @param td
 */
const selectedRangeBg = (td: IDate) => {
  if (
    td.category === "curr" &&
    selectedDateTimeRange.value &&
    selectedDateTimeRange.value.length === 2 &&
    td.timestamp < selectedDateTimeRange.value[1].val &&
    td.timestamp > selectedDateTimeRange.value[0].val
  ) {
    return "dc-selected-range-bg";
  }
  return "";
};
/**
 * 被选中的开始和结束的背景颜色
 * @param td
 * @param index
 */
const selectedDateBoundary = (td: IDate, index: number) => {
  if (
    index === 0 &&
    td.category === "curr" &&
    selectedDateTimeRange.value &&
    selectedDateTimeRange.value.length === 2 &&
    dateFormat(td.timestamp) ===
      dateFormat(selectedDateTimeRange.value[index].val)
  ) {
    return "dc-selected-date-left-boundary";
  } else if (
    index === 1 &&
    td.category === "curr" &&
    selectedDateTimeRange.value &&
    selectedDateTimeRange.value.length === 2 &&
    dateFormat(td.timestamp) ===
      dateFormat(selectedDateTimeRange.value[index].val)
  ) {
    return "dc-selected-date-right-boundary";
  }
  return "";
};

/**
 * 被选中的开始和结束的样式
 * @param td
 */
const selectedDate = (td: IDate) => {
  if (
    td.category === "curr" &&
    selectedDateTimeRange &&
    selectedDateTimeRange.value.length !== 0
  ) {
    if (
      selectedDateTimeRange.value.length === 1 &&
      dateFormat(td.timestamp) ===
        dateFormat(selectedDateTimeRange.value[0]?.val!)
    ) {
      return "dc-selected-date";
    } else if (selectedDateTimeRange.value.length === 2) {
      if (
        dateFormat(td.timestamp) ===
          dateFormat(selectedDateTimeRange.value[0]?.val!) ||
        dateFormat(td.timestamp) ===
          dateFormat(selectedDateTimeRange.value[1]?.val!)
      ) {
        return "dc-selected-date";
      }
    }
  }
  return "";
};
</script>

<style lang="scss" scoped>
$common-border: 1px solid #ebeef5;

.dc-input {
  outline: none;
  border: none;
}

.dc-table {
  min-width: 291px;
  border-spacing: 0 10px !important;

  .dc-td {
    text-align: center;
    cursor: pointer;
    height: 38px;
    width: 38px;
    font-size: 12px;
  }
}

.dc-calendar-input {
  border: 1px solid #dcdfe6;
  padding: 5px;
  min-width: 320px;
  display: inline-flex;

  span {
    margin: 0 15px;
  }
}

.dc-calendar {
  width: 646px;
  border: $common-border;
  background-color: #fff;

  &-header {
    padding: 5px;
    display: table;

    &-left,
    &-right {
      display: table-cell;
      span {
        display: table-cell;
        padding: 0 5px;
      }
    }

    &-separator {
      margin: 0 10px 0 15px;
    }
  }

  &-content {
    display: flex;
    justify-content: space-between;
    border-top: $common-border;
    border-bottom: $common-border;

    &-left,
    &-right {
      width: 49%;
      padding: 16px;
    }

    &-left {
      border-right: 1px solid #e4e4e4;

      &-top {
        display: flex;
        margin-bottom: 10px;

        &-date {
          margin-left: 50px;
        }

        &-icon {
          span {
            margin-right: 10px;
          }
        }
      }
    }

    &-right {
      &-top {
        display: flex;
        justify-content: right;
        margin-bottom: 10px;

        &-date {
          margin-right: 50px;
        }

        &-icon {
          span {
            margin-left: 10px;
          }
        }
      }
    }
  }

  &-footer {
    display: flex;
    justify-content: right;
    margin: 10px 0;

    button {
      border: $common-border;
      background-color: #fff;
      color: #409eff;
      padding: 5px 15px;
      margin: 0 5px;
      cursor: pointer;
    }
  }
}

.dc-calendar-content-left-top-icon,
.dc-calendar-content-right-top-icon {
  cursor: pointer;
  user-select: none;
}

.dc-prev-and-next {
  color: #a8abb2;
}

.dc-today-style {
  color: #409eff;
}

.dc-selected-date {
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  line-height: 24px;
}

.dc-selected-date-left-boundary {
  background-color: #f2f6fc;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.dc-selected-date-right-boundary {
  background-color: #f2f6fc;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.dc-selected-range-bg {
  background-color: #f2f6fc;
}
</style>
