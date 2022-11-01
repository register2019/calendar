<template>
  <div @click="openCalendar" class="dc-calendar-input" ref="calendarInput">
    <input type="text" class="dc-input" v-model="startDateTime" />
    <span>{{ props.rangeSeparator }}</span>
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
              v-bind="$attrs"
            />
            <span class="dc-calendar-header-separator">&gt;</span>
            <PanelInput
              v-model:date="modelRightInput"
              v-model:time="endTimeType"
              :inputIsDisabled="inputIsDisabled"
              :timeType="props.timeType"
              inputPosition="end"
              @update-input-position="updateInputPosition"
              v-bind="$attrs"
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
                @emit-selected-date="emitSelectedDate"
                v-bind="$attrs"
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
                @emit-selected-date="emitSelectedDate"
                v-bind="$attrs"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="dc-calendar-footer">
        <DefaultButton type="text" size="small" @click="cancelBtn">
          取消
        </DefaultButton>
        <DefaultButton size="small" @click="submitBtn"> 确定 </DefaultButton>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DateTimePicker",
};
</script>
<script lang="ts" setup>
import { ref, watch, computed, CSSProperties, useAttrs } from "vue";
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
import PanelTable from "../Components/panelTable.vue";
import PanelInput from "../Components/panelInput.vue";
import PanelSider from "../Components/panelSider.vue";
import DefaultButton from "../../Button/index.vue";
import { PickerOptions, SelectedDateList } from "../constants";
import { SelectOptions } from "../../../utils/timeSelect";

const calendarPanel = ref(false);
const calendarRef = ref();

const startDateTime = ref<string>();
const endDateTime = ref<string>();
const startTimePicker = ref<string>();
const endTimePicker = ref<string>();
const startTimeSelect = ref<string>();
const endTimeSelect = ref<string>();
const selectedDateList = ref<SelectedDateList[]>([]);
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
  rangeSeparator?: string;
};
const props = withDefaults(defineProps<Props>(), {
  unlinkPanels: false,
  modelValue: (): Date[] => [],
  timeType: "Picker",
  rangeSeparator: "至",
});

const emit = defineEmits(["update:modelValue", "onClick"]);

if (props.pickerOptions && props.pickerOptions.length > 0) {
  calendarStyle.value.width = "782px";
}

let leftDateYear = ref(0);
let leftDateMonth = ref(0);
let rightDateYear = ref(0);
let rightDateMonth = ref(0);

let leftTds = ref<IDate[]>([]);
let rightTds = ref<IDate[]>([]);

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
    {
      val: dateToTimeStamp(
        defaultStartYear +
          "-" +
          defaultStartMonth +
          "-" +
          defaultStartDay +
          " " +
          "00:00:00"
      ),
      category: "click",
    },
    {
      val: dateToTimeStamp(
        defaultEndYear +
          "-" +
          defaultEndMonth +
          "-" +
          defaultEndDay +
          " " +
          "00:00:00"
      ),
      category: "click",
    },
  ];
};
const startTimeType = ref(
  props.timeType === "Select" ? startTimeSelect : startTimePicker
);
const endTimeType = ref(
  props.timeType === "Select" ? endTimeSelect : endTimePicker
);
const attrs = useAttrs();
const selectedPickerOptions = (val: PickerOptions) => {
  selectedDateList.value = [];
  const pickerTimeRange = val.value() as number[];
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

  startTimeType.value = attrs.selectOptions
    ? (attrs.selectOptions as SelectOptions).start
    : "08:30";
  endTimeType.value = attrs.selectOptions
    ? (attrs.selectOptions as SelectOptions).start
    : "08:30";
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
    selectedDateList.value.length === 2 &&
    category === "click" &&
    selectedDateList.value[0].category === "click" &&
    selectedDateList.value[1].category === "click"
  ) {
    selectedDateList.value = [];
    selectedDateList.value.push({ val: td.timestamp, category });
    inputIsDisabled.value = true;
  } else if (selectedDateList.value.length === 0 && category === "click") {
    selectedDateList.value.push({ val: td.timestamp, category });
    inputIsDisabled.value = true;
    modelLeftInput.value = dateFormat(selectedDateList.value[0].val);
    modelRightInput.value = dateFormat(selectedDateList.value[0].val);
  } else if (selectedDateList.value.length === 1 && category === "mouse") {
    if (td.timestamp >= selectedDateList.value[0].val) {
      selectedDateList.value.push({ val: td.timestamp, category });
    } else {
      selectedDateList.value.unshift({ val: td.timestamp, category });
    }
    inputIsDisabled.value = true;
  } else if (
    (selectedDateList.value.length === 2 && category === "mouse") ||
    (selectedDateList.value.length === 2 && category === "click")
  ) {
    if (
      td.timestamp >=
      selectedDateList.value.find((item) => item.category === "click")!.val
    ) {
      selectedDateList.value = selectedDateList.value.filter(
        (item) => item.category !== "mouse"
      );
      selectedDateList.value.push({ val: td.timestamp, category });
    } else {
      selectedDateList.value = selectedDateList.value.filter(
        (item) => item.category !== "mouse"
      );
      selectedDateList.value.unshift({ val: td.timestamp, category });
    }

    if (category === "click") {
      inputIsDisabled.value = false;
      modelLeftInput.value = dateFormat(selectedDateList.value[0].val);
      modelRightInput.value = dateFormat(selectedDateList.value[1].val);
    } else {
      inputIsDisabled.value = true;
    }
  }
  startTimePicker.value = "00:00:00";
  endTimePicker.value = "00:00:00";
};

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

  [startTimeStamp, endTimeStamp]
    .sort((a, b) => a - b)
    .forEach((item) => {
      selectedDateList.value.push({
        val: item,
        category: "click",
      });
    });
  modelLeftInput.value = dateFormat(selectedDateList.value[0].val);
  modelRightInput.value = dateFormat(selectedDateList.value[1].val);

  if (updateDateBroundry.value === "start") {
    const { year: startYear, month: startMonth } = getTimeUtils(
      selectedDateList.value[0].val
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
      selectedDateList.value[1].val
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
  if (props.unlinkPanels) {
    if (unlinkLeft.value) {
      leftTds.value = getCurrPageDays(leftDateYear.value, leftDateMonth.value);
    }
    if (unlinkRight.value) {
      rightTds.value = getCurrPageDays(
        rightDateYear.value,
        rightDateMonth.value
      );
    }
  } else {
    leftTds.value = getCurrPageDays(leftDateYear.value, leftDateMonth.value);
    rightTds.value = getCurrPageDays(rightDateYear.value, rightDateMonth.value);
  }
};

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
  startDateTime.value = dateTimeFormat(props.modelValue[0], props.timeType);
  endDateTime.value = dateTimeFormat(props.modelValue[1], props.timeType);
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
  if (props.timeType === "Picker") {
    startTimePicker.value = leftHour + ":" + leftMinu + ":" + leftSeco;
    endTimePicker.value = rightHour + ":" + rightMinu + ":" + rightSeco;
  } else {
    startTimeSelect.value = leftHour + ":" + leftMinu;
    endTimeSelect.value = rightHour + ":" + rightMinu;
  }

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

// 面板取消联动时 初始化页面
if (props.unlinkPanels) {
  unlinkLeft.value = true;
  unlinkRight.value = true;
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

  startDateTime.value =
    dateFormat(selectedDateList.value[0].val) + " " + startTime;

  endDateTime.value = dateFormat(selectedDateList.value[1].val) + " " + endTime;

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
    margin: 10px;
  }
}

.dc-calendar-content-left-top-icon,
.dc-calendar-content-right-top-icon {
  cursor: pointer;
  user-select: none;
}
</style>
