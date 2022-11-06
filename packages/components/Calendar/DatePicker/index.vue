<template>
  <div class="dc-date-picker-input" ref="inputRef" @click="openPanel">
    <DefaultInput v-model="startDateInput" class="borderUI" />
    <span>{{ props.rangeSeparator }}</span>
    <DefaultInput v-model="endDateInput" class="borderUI" />
  </div>
  <Teleport to="body">
    <div
      ref="panelRef"
      :style="calendarStyle"
      class="dc-date-picker-panel"
      v-show="isShowPanel"
    >
      <PanelSider
        v-if="props.pickerOptions && props.pickerOptions.length !== 0"
        :pickerOptions="props.pickerOptions"
        @selected-picker-options="selectedPickerOptions"
      />
      <div class="dc-date-picker-panel-table">
        <div class="dc-date-picker-panel-table-left">
          <div class="header">
            <span>
              <span @click="clickBefore('year')">&lt;&lt;</span>
              <span @click="clickBefore('month')" style="margin-left: 10px"
                >&lt;</span
              >
            </span>
            <span class="title">{{ startDate }}</span>
            <span></span>
          </div>
          <PanelTable
            v-bind="$attrs"
            :tds="leftTds"
            :selected-date-list="selectedDateList"
            @emit-selected-date="emitSelectedDate"
          />
        </div>
        <div class="dc-date-picker-panel-table-right">
          <div class="header">
            <span></span>
            <span class="title">{{ endDate }}</span>
            <span>
              <span @click="clickAfter('month')" style="margin-right: 10px"
                >&gt;</span
              >
              <span @click="clickAfter('year')">&gt;&gt;</span>
            </span>
          </div>
          <PanelTable
            v-bind="$attrs"
            :tds="rightTds"
            :selected-date-list="selectedDateList"
            @emit-selected-date="emitSelectedDate"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DefaultDatePicker",
};
</script>
<script lang="ts" setup>
import {
  onClickOutside,
  useElementBounding,
  useWindowSize,
} from "@vueuse/core";
import { ref, computed, CSSProperties, nextTick } from "vue";
import {
  dateFormat,
  dateToTimeStamp,
  getCurrPageDays,
  getTimeUtils,
  IDate,
  timeFormat,
} from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelTable from "../Components/panelTable.vue";
import PanelSider from "../Components/panelSider.vue";
import { PickerOptions, SelectedDateList } from "../constants";

type Props = {
  modelValue?: Date[];
  unlinkPanels?: boolean;
  pickerOptions?: PickerOptions[];
  rangeSeparator?: string;
};

const props = withDefaults(defineProps<Props>(), {
  unlinkPanels: false,
  rangeSeparator: "至",
});
const emit = defineEmits(["onClick"]);

const panelRef = ref();
const inputRef = ref();
const isShowPanel = ref(false);

const startYear = ref(0);
const startMonth = ref(0);
const endYear = ref(0);
const endMonth = ref(0);
const startDateInput = ref("");
const endDateInput = ref("");
const calendarStyle = ref<CSSProperties>({
  position: "absolute",
  top: "",
  left: "",
  width: "646px",
});

const leftTds = ref();
const rightTds = ref();

const startDate = computed(
  () => startYear.value + "年" + timeFormat(startMonth.value) + "月"
);
const endDate = computed(
  () => endYear.value + "年" + timeFormat(endMonth.value) + "月"
);

const clickBefore = (type: string) => {
  if (props.unlinkPanels) {
    // 设置左右面板不联动
    if (type === "year") {
      startYear.value--;
    } else {
      if (startMonth.value === 1) {
        startYear.value--;
        startMonth.value = 12;
      } else {
        startMonth.value--;
      }
    }
  } else {
    if (type === "year") {
      startYear.value--;
      endYear.value--;
    } else {
      if (startMonth.value === 1) {
        startYear.value--;
        startMonth.value = 12;
        endMonth.value--;
      } else if (endMonth.value === 1) {
        endYear.value--;
        endMonth.value = 12;
        startMonth.value--;
      } else {
        startMonth.value--;
        endMonth.value--;
      }
    }
  }
  leftTds.value = getCurrPageDays(startYear.value, startMonth.value);
  rightTds.value = getCurrPageDays(endYear.value, endMonth.value);
};
const clickAfter = (type: string) => {
  if (props.unlinkPanels) {
    if (type === "year") {
      endYear.value++;
    } else {
      if (endMonth.value === 12) {
        endYear.value++;
        endMonth.value = 1;
      } else {
        endMonth.value++;
      }
    }
  } else {
    if (type === "year") {
      startYear.value++;
      endYear.value++;
    } else {
      if (endMonth.value === 12) {
        endYear.value++;
        endMonth.value = 1;
        startMonth.value++;
      } else if (startMonth.value === 12) {
        startYear.value++;
        startMonth.value = 1;
        endMonth.value++;
      } else {
        startMonth.value++;
        endMonth.value++;
      }
    }
  }
  leftTds.value = getCurrPageDays(startYear.value, startMonth.value);
  rightTds.value = getCurrPageDays(endYear.value, endMonth.value);
};

const initTableData = (year: number, month: number) => {
  if (month === 12) {
    startYear.value = year;
    startMonth.value = month;
    endYear.value = year++;
    endMonth.value = 1;
  } else {
    startYear.value = year;
    startMonth.value = month;
    endYear.value = year;
    endMonth.value = month + 1;
  }
  leftTds.value = getCurrPageDays(startYear.value, startMonth.value);
  rightTds.value = getCurrPageDays(endYear.value, endMonth.value);
};

const initInput = (val: number[]) => {
  startDateInput.value = dateFormat(val[0]);
  endDateInput.value = dateFormat(val[1]);
  isShowPanel.value = false;
  const { year, month } = getTimeUtils(val[0]);
  initTableData(year, Number(month));
  emit("onClick", [val[0], val[1]]);
};

const selectedDateList = ref<SelectedDateList[]>([]);
const emitSelectedDate = (val: IDate, category: string) => {
  const { timestamp } = val;
  if (
    selectedDateList.value.length === 2 &&
    selectedDateList.value[0].category === "click" &&
    selectedDateList.value[1].category === "click"
  ) {
    selectedDateList.value = [];
    selectedDateList.value.push({ val: timestamp, category });
  } else if (selectedDateList.value.length === 0 && category === "click") {
    selectedDateList.value.push({ val: timestamp, category });
  } else if (selectedDateList.value.length === 1 && category === "mouse") {
    if (timestamp >= selectedDateList.value[0].val) {
      selectedDateList.value.push({ val: timestamp, category });
    } else {
      selectedDateList.value.unshift({ val: timestamp, category });
    }
  } else if (
    (selectedDateList.value.length === 2 && category === "mouse") ||
    (selectedDateList.value.length === 2 && category === "click")
  ) {
    const target = selectedDateList.value.find(
      (item) => item.category === "click"
    )!;
    selectedDateList.value = [];
    selectedDateList.value.push(target);
    if (timestamp >= target.val) {
      selectedDateList.value.push({ val: timestamp, category });
    } else {
      selectedDateList.value.unshift({ val: timestamp, category });
    }
    if (category === "click") {
      initInput([selectedDateList.value[0].val, selectedDateList.value[1].val]);
    }
  }
};

const selectedPickerOptions = (val: PickerOptions) => {
  if (props.modelValue && props.modelValue.length !== 0) {
    selectedDateList.value = [];
  }
  const target = val.value() as number[];
  for (let i = 0; i < target.length; i++) {
    selectedDateList.value.push({
      val: target[i],
      category: "click",
    });
  }
  initInput(target);
};

onClickOutside(panelRef, () => {
  isShowPanel.value = false;
});

const openPanel = () => {
  const { top, left, height, bottom } = useElementBounding(inputRef);

  calendarStyle.value.top = top.value + height.value + 5 + "px";
  calendarStyle.value.left = left.value + "px";

  isShowPanel.value = true;
  nextTick(() => {
    const { height: panelHeight } = useElementBounding(panelRef);
    const { height } = useWindowSize();
    if (bottom.value + panelHeight.value >= height.value) {
      calendarStyle.value.top = top.value - panelHeight.value - 5 + "px";
    }
  });
};

if (props.pickerOptions) {
  calendarStyle.value.width = "782px";
}
if (props.modelValue && props.modelValue.length !== 0) {
  props.modelValue.forEach((item) => {
    selectedDateList.value.push({
      val: dateToTimeStamp(item),
      category: "click",
    });
  });
  const { year, month } = getTimeUtils(props.modelValue[0]);
  startDateInput.value = dateFormat(selectedDateList.value[0].val);
  endDateInput.value = dateFormat(selectedDateList.value[1].val);
  initTableData(year, Number(month));
} else {
  let { year, month } = getTimeUtils();
  initTableData(year, Number(month));
}
</script>

<style lang="scss" scoped>
$borderUI: 1px solid var(--border-color);
.dc-date-picker-input {
  display: flex;
  align-items: center;
  width: 350px;
  border: $borderUI;
  span {
    margin: 0 6px;
  }
  :deep(.borderUI) > input {
    border: none;
  }
}
.dc-date-picker-panel {
  display: flex;
  border: $borderUI;
  &-table {
    display: flex;
    width: 100%;
    padding: 5px 8px 10px;
    &-left,
    &-right {
      padding: 10px 11px;
    }
    &-left {
      border-right: $borderUI;
    }
  }
}
.header {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  cursor: pointer;
  user-select: none;
  .title {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
