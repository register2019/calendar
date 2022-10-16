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
      <div style="display: flex; border-bottom: 1px solid #ebeef5">
        <PanelSider
          v-if="props.pickerOptions && props.pickerOptions.length !== 0"
          :pickerOptions="props.pickerOptions"
          @selected-picker-options="selectedPickerOptions"
        />
        <div>
          <div class="dc-calendar-header">
            <PanelInput
              v-model:date="modelLeftInput"
              v-model:time="startTimeType"
              :inputIsDisabled="inputIsDisabled"
              :timeType="props.timeType"
              inputPosition="start"
              @update-input-position="updateInputPosition"
            />
            <span class="dc-calendar-header-separator">&gt;</span>
            <PanelInput
              v-model:date="modelRightInput"
              v-model:time="endTimeType"
              :inputIsDisabled="inputIsDisabled"
              :timeType="props.timeType"
              inputPosition="end"
              @update-input-position="updateInputPosition"
            />
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
              <PanelTable
                :tds="leftTds"
                :selectedDateList="selectedDateList"
                :isSelectedFinish="isSelectedFinish"
                @emit-selected-date="emitSelectedDate"
              />
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
              <PanelTable
                :tds="rightTds"
                :selectedDateList="selectedDateList"
                :isSelectedFinish="isSelectedFinish"
                @emit-selected-date="emitSelectedDate"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="dc-calendar-footer">
        <button @click="cancelBtn" class="dc-calendar-footer-cancel">
          取消
        </button>
        <button @click="submitBtn" class="dc-calendar-footer-submit">
          确定
        </button>
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
  getCurrAdjacentMonth,
  unlinkBefore,
  unlinkAfter,
  getCurrPageDays,
  IDate,
  dateFormat,
  dateTimeFormat,
  initCalendarPanel,
  dateToTimeStamp,
  determineTheDateFormat,
  formatPanelDate,
  getTimeUtils,
  timeToOneDayStart,
} from "../../../utils";
import PanelTable from "./panelTable.vue";
import PanelInput from "./panelInput.vue";
import PanelSider from "./panelSider.vue";
import { PickerOptions } from "./constants";

const calendarPanel = ref(false);
const calendarRef = ref();

const startDateTime = ref<string>();
const endDateTime = ref<string>();
const startTimePicker = ref<string>();
const endTimePicker = ref<string>();
const startTimeSelect = ref<string>();
const endTimeSelect = ref<string>();
const selectedDateList = ref<number[]>([]);
const updateDateBroundry = ref("");

const calendarInput = ref(null);
const calendarStyle = ref<CSSProperties>({
  position: "absolute",
  top: "",
  left: "",
  width: "646px",
});

onClickOutside(calendarRef, () => {
  calendarPanel.value = false;
  isSelectedDateRange.value = false;
});

type Props = {
  unlinkPanels?: boolean; // 是否取消左右日期间的联动 默认是联动的
  modelValue?: Date[];
  timeType?: string; // 默认是Picker 可选值为Picker和Select
  pickerOptions?: PickerOptions[];
};
const props = withDefaults(defineProps<Props>(), {
  unlinkPanels: false,
  modelValue: (): Date[] => [],
  timeType: "Picker",
});

const emit = defineEmits(["update:modelValue", "onClick"]);

if (props.pickerOptions && props.pickerOptions.length > 0) {
  calendarStyle.value.width = "782px";
}

let leftDateYear = ref(0);
let leftDateMonth = ref(0);
let rightDateYear = ref(0);
let rightDateMonth = ref(0);

let leftTds = ref<IDate[][]>([]);
let rightTds = ref<IDate[][]>([]);

let unlinkLeft = ref(false);
let unlinkRight = ref(false);

let modelLeftInput = ref();
let modelRightInput = ref();

// 是否完成选择
let isCompleteSelection = ref(false);

/**
 * 初始化SelectedDateTimeRange
 */
const initSelectedDateTimeRange = (value: string[] | Date[]) => {
  const {
    year: defaultStartYear,
    month: defaultStartMonth,
    day: defaultStartDay,
  } = getTimeUtils(value[0]);

  const {
    year: defaultEndYear,
    month: defaultEndMonth,
    day: defaultEndDay,
  } = getTimeUtils(value[1]);
  selectedDateList.value = [
    dateToTimeStamp(
      defaultStartYear +
        "-" +
        defaultStartMonth +
        "-" +
        defaultStartDay +
        " " +
        "00:00:00"
    ),
    dateToTimeStamp(
      defaultEndYear +
        "-" +
        defaultEndMonth +
        "-" +
        defaultEndDay +
        " " +
        "00:00:00"
    ),
  ];
};

const selectedPickerOptions = (val: PickerOptions) => {
  const pickerTimeRange = val.value();
  const {
    year: startYear,
    month: startMonth,
    day: startDay,
  } = getTimeUtils(pickerTimeRange[0]);
  const { day: endDay } = getTimeUtils(pickerTimeRange[1]);
  const startPicker = {
    value: Number(startDay),
    category: "curr",
    timestamp: timeToOneDayStart(pickerTimeRange[0]),
  };
  const endPicker = {
    value: Number(endDay),
    category: "curr",
    timestamp: timeToOneDayStart(pickerTimeRange[1]),
  };

  let diffMonth = 0;
  if (Number(startYear) === leftDateYear.value) {
    diffMonth = Math.abs(Number(startMonth) - leftDateMonth.value);
  } else {
    diffMonth = Math.abs(Number(startMonth) - leftDateMonth.value) + 12;
  }

  for (let i = 0; i < diffMonth; i++) {
    clickBefore("month");
  }

  selectDate(startPicker!, "click");
  selectDate(endPicker!, "mouse");
  selectDate(endPicker!, "click");

  updateInputPosition("start");
};

const clickAfter = (category: string) => {
  unlinkRight.value = true;
  if (unlinkLeft.value) {
    unlinkLeft.value = false;
  }
  if (category === "month") {
    rightDateMonth.value++;
    if (props.unlinkPanels) {
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
    if (!props.unlinkPanels) {
      leftDateYear.value++;
    }
  }
  updateCalendarPanel();
};

const clickBefore = (category: string) => {
  unlinkLeft.value = true;
  if (unlinkRight.value) {
    unlinkRight.value = false;
  }
  if (category === "month") {
    leftDateMonth.value--;
    if (props.unlinkPanels) {
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
    if (!props.unlinkPanels) {
      rightDateYear.value--;
    }
  }
  updateCalendarPanel();
};

const emitSelectedDate = (val: IDate, category: string) => {
  selectDate(val, category);
};

const selectDate = (td: IDate, category?: string) => {
  if (
    category == "click" &&
    selectedDateList.value.length === 2 &&
    selectedDateList.value[0] !== td.timestamp &&
    selectedDateList.value[1] !== td.timestamp
  ) {
    selectedDateList.value = [];
    selectedDateList.value.push(td.timestamp);
    return;
  }

  // 解决在一个面板中完成了日期选择 另一个面板没有选中 当移入另一个时出现选中的情况
  if (category == "click" && selectedDateList.value.length === 2) {
    isSelectedFinish.value = true;
    inputIsDisabled.value = false;
  }
  if (selectedDateList.value.length < 2) {
    selectedDateList.value.push(td.timestamp);
    modelLeftInput.value = dateFormat(selectedDateList.value[0]);
    modelRightInput.value = dateFormat(selectedDateList.value[0]);
    inputIsDisabled.value = true;
  } else {
    selectedDateList.value.pop();
    selectedDateList.value.push(td.timestamp);
    selectedDateList.value.sort((a, b) => a - b);
    modelLeftInput.value = dateFormat(selectedDateList.value[0]);
    modelRightInput.value = dateFormat(selectedDateList.value[1]);
  }
  startTimePicker.value = "00:00:00";
  endTimePicker.value = "00:00:00";
};

const startTimeType =
  props.timeType === "Select" ? startTimeSelect : startTimePicker;
const endTimeType = props.timeType === "Select" ? endTimeSelect : endTimePicker;

const inputIsDisabled = ref(false);

// 是否是点击日历面板选择日期 主要用于区别输入框修改日期 日历面板更新的情况
const isSelectedDateRange = ref(false);

/**
 * 更新面板日期
 */
function updateDateTime(dateList: number[]) {
  modelLeftInput.value = dateFormat(dateList[0]);
  modelRightInput.value = dateFormat(dateList[1]);
}

const isSelectedFinish = ref(false);
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
  if (selectedDateList.value.length === 2) {
    isSelectedFinish.value = true;
  }
};
for (let i = 0; i < 6; i++) {
  leftTds.value[i] = [];
  rightTds.value[i] = [];
}
const initArr = (initLeft: string, initRight: string) => {
  for (let i = 0; i < 6; i++) {
    if (!props.unlinkPanels) {
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

const updateInputPosition = (val: string) => {
  updateDateBroundry.value = val;

  const startTimeStamp = dateToTimeStamp(
    modelLeftInput.value + " " + startTimePicker.value
  );
  const endTimeStamp = dateToTimeStamp(
    modelRightInput.value + " " + endTimePicker.value
  );
  if (
    !determineTheDateFormat(modelLeftInput.value) ||
    !determineTheDateFormat(modelRightInput.value)
  )
    return;

  selectedDateList.value = [startTimeStamp, endTimeStamp].sort((a, b) => a - b);
  modelLeftInput.value = dateFormat(selectedDateList.value[0]);
  modelRightInput.value = dateFormat(selectedDateList.value[1]);

  if (updateDateBroundry.value === "start") {
    const { year: startYear, month: startMonth } = getTimeUtils(
      selectedDateList.value[0]
    );

    leftDateYear.value = startYear;
    leftDateMonth.value = Number(startMonth);
    if (leftDateMonth.value === 12) {
      rightDateYear.value = startYear + 1;
      rightDateMonth.value = 1;
    } else {
      rightDateYear.value = startYear;
      rightDateMonth.value = Number(startMonth) + 1;
    }
  } else {
    const { year: endYear, month: endMonth } = getTimeUtils(
      selectedDateList.value[1]
    );
    rightDateYear.value = endYear;
    rightDateMonth.value = Number(endMonth);
    if (rightDateMonth.value === 1) {
      leftDateYear.value = endYear - 1;
      leftDateMonth.value = 12;
    } else {
      leftDateYear.value = endYear;
      leftDateMonth.value = Number(endMonth) - 1;
    }
  }
  updateCalendarPanel();
};

watch([startTimePicker, endTimePicker], (val) => {
  if (props.modelValue.length === 0) {
    if (modelLeftInput.value === "" && modelRightInput.value === "") {
      const { year, month, day } = getTimeUtils();
      modelLeftInput.value = year + "-" + month + "-" + day;
      modelRightInput.value = year + "-" + month + "-" + day;
    }

    if (typeof val[0] === "undefined") {
      startTimePicker.value = val[1];
    } else if (typeof val[1] === "undefined") {
      endTimePicker.value = val[0];
    }
  }
});

const updateCalendarPanel = () => {
  initArr("default", "default");
  updateLeftPanel([leftDateYear.value, leftDateMonth.value]);
  updateRightPanel([rightDateYear.value, rightDateMonth.value]);
};

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
// 更新右侧面板 E

const leftDate = computed(() => {
  let month = formatPanelDate(leftDateMonth.value);

  return leftDateYear.value + "年" + month + "月";
});
const rightDate = computed(() => {
  let month = formatPanelDate(rightDateMonth.value);
  return rightDateYear.value + "年" + month + "月";
});

if (props.modelValue && props.modelValue.length === 2) {
  isCompleteSelection.value = true;
  // 有默认时间
  startDateTime.value = dateTimeFormat(props.modelValue[0]);
  endDateTime.value = dateTimeFormat(props.modelValue[1]);
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
  } = initCalendarPanel(props.modelValue);
  leftDateYear.value = leftYear;
  leftDateMonth.value = Number(leftMonth);
  rightDateYear.value = rightYear;
  rightDateMonth.value = Number(rightMonth);

  // 初始化日期
  updateDateTime([
    dateToTimeStamp(props.modelValue[0]),
    dateToTimeStamp(props.modelValue[1]),
  ]);

  // 初始化时间
  startTimePicker.value = leftHour + ":" + leftMinu + ":" + leftSeco;
  endTimePicker.value = rightHour + ":" + rightMinu + ":" + rightSeco;

  initSelectedDateTimeRange(props.modelValue);
  updateCalendarPanel();
} else {
  // 没有默认时间
  const { leftYear, leftMonth, rightYear, rightMonth } = getCurrAdjacentMonth();
  leftDateYear.value = leftYear;
  leftDateMonth.value = leftMonth;
  rightDateYear.value = rightYear;
  rightDateMonth.value = rightMonth;
  updateCalendarPanel();
}

const cancelBtn = () => {
  calendarPanel.value = false;
  isSelectedDateRange.value = false;
};

const submitBtn = () => {
  const startTime =
    props.timeType === "Select" ? startTimeSelect.value : startTimePicker.value;
  const endTime =
    props.timeType === "Select" ? endTimeSelect.value : endTimePicker.value;

  startDateTime.value = dateFormat(selectedDateList.value[0]) + " " + startTime;

  endDateTime.value = dateFormat(selectedDateList.value[1]) + " " + endTime;

  calendarPanel.value = false;

  const emitParentComponentVal = [
    selectedDateList.value[0],
    selectedDateList.value[1],
  ];
  emit("update:modelValue", emitParentComponentVal);

  emit("onClick", emitParentComponentVal);
  isSelectedDateRange.value = false;
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
  border: $common-border;
  background-color: #fff;

  &-header {
    padding: 5px;
    display: table;
    &-separator {
      margin: 0 10px 0 15px;
    }
  }

  &-content {
    display: flex;
    justify-content: space-between;
    border-top: $common-border;

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

      padding: 5px 15px;
      margin: 0 5px;
      cursor: pointer;
    }
    &-cancel {
      color: #000;
    }
    &-submit {
      color: #409eff;
    }
  }
}

.dc-calendar-content-left-top-icon,
.dc-calendar-content-right-top-icon {
  cursor: pointer;
  user-select: none;
}
</style>
