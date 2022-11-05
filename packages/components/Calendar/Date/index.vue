<template>
  <div class="dc-date-input" @click="openPanel" ref="inputRef">
    <DefaultInput v-model="inputDate" />
  </div>
  <Teleport to="body">
    <div
      ref="panelRef"
      class="dc-date-panel"
      :style="panelPosition"
      v-show="isShowPanel"
    >
      <PanelSider
        v-if="props.pickerOptions && props.pickerOptions.length !== 0"
        :pickerOptions="props.pickerOptions"
        @selected-picker-options="selectedPickerOptions"
      />
      <div class="dc-date-panel-table">
        <div class="dc-date-panel-table-header">
          <span>
            <span @click="beforeClick('year')">&lt;&lt;</span>
            <span @click="beforeClick('month')">&lt;</span>
          </span>
          <span>{{ tableHeader }}</span>
          <span>
            <span @click="afterClick('month')">&gt;</span>
            <span @click="afterClick('year')">&gt;&gt;</span>
          </span>
        </div>
        <PanelTable
          :tds="tds"
          type="Date"
          :curr-date-time="inputDate"
          @emit-selected-date="emitSelectedDate"
          v-bind="$attrs"
        />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DefaultDate",
};
</script>
<script lang="ts" setup>
import {
  onClickOutside,
  useElementBounding,
  useWindowSize,
} from "@vueuse/core";
import { ref, computed, CSSProperties, nextTick, watch } from "vue";
import {
  dateToTimeStamp,
  getCurrPageDays,
  getTimeUtils,
  IDate,
} from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelTable from "../Components/panelTable.vue";
import PanelSider from "../Components/panelSider.vue";
import { PickerOptions } from "../constants";

const panelRef = ref();
const isShowPanel = ref(false);
const inputRef = ref();
const panelPosition = ref<CSSProperties>({
  position: "absolute",
  top: "",
  left: "",
  width: "312px",
});
const { year, month } = getTimeUtils();
const tds = ref(getCurrPageDays(year, Number(month)));
const emit = defineEmits(["onClick"]);

type Props = {
  modelValue: Date;
  pickerOptions?: PickerOptions[];
};

const props = defineProps<Props>();

const openPanel = () => {
  const { top, left, height, bottom } = useElementBounding(inputRef);

  panelPosition.value.top = top.value + height.value + 5 + "px";
  panelPosition.value.left = left.value + "px";

  isShowPanel.value = true;
  nextTick(() => {
    const { height: panelHeight } = useElementBounding(panelRef);
    const { height } = useWindowSize();
    if (bottom.value + panelHeight.value >= height.value) {
      panelPosition.value.top = top.value - panelHeight.value - 5 + "px";
    }
  });
};

onClickOutside(panelRef, () => {
  isShowPanel.value = false;
});
/**
 * 处理面板表格和面板Header数据
 * @param year
 * @param month
 */
const panelAndHeaderData = (year: number, month: string) => {
  tds.value = getCurrPageDays(year, Number(month));
  currYear.value = year;
  currMonth.value = Number(month);
};
const dynamicSelectedDate = (val: string) => {
  const { year, month } = getTimeUtils(val);
  panelAndHeaderData(year, month);
  emit("onClick", dateToTimeStamp(val));
};

const inputDate = ref("");
const emitSelectedDate = (val: IDate) => {
  const { year, month, day } = getTimeUtils(val.timestamp);
  inputDate.value = year + "-" + month + "-" + day;
  isShowPanel.value = false;
  dynamicSelectedDate(inputDate.value);
};

const currYear = ref(year);
const currMonth = ref(Number(month));
const tableHeader = computed(
  () => currYear.value + "年" + currMonth.value + "月"
);
const beforeClick = (params: string) => {
  if (params === "year") {
    currYear.value--;
  } else if (params === "month") {
    if (currMonth.value === 1) {
      currYear.value--;
      currMonth.value = 12;
    } else {
      currMonth.value--;
    }
  }
  tds.value = getCurrPageDays(currYear.value, currMonth.value);
};
const afterClick = (params: string) => {
  if (params === "year") {
    currYear.value++;
  } else if (params === "month") {
    if (currMonth.value === 12) {
      currYear.value++;
      currMonth.value = 1;
    } else {
      currMonth.value++;
    }
  }
  tds.value = getCurrPageDays(currYear.value, currMonth.value);
};
const selectedPickerOptions = (val: PickerOptions) => {
  const { year, month, day } = getTimeUtils(val.value() as number);
  inputDate.value = year + "-" + month + "-" + day;
  isShowPanel.value = false;
  dynamicSelectedDate(inputDate.value);
};

if (props.pickerOptions && props.pickerOptions.length !== 0) {
  panelPosition.value.width = "448px";
}
if (props.modelValue) {
  const { year, month, day } = getTimeUtils(props.modelValue);
  inputDate.value = year + "-" + month + "-" + day;
  panelAndHeaderData(year, month);
}
</script>

<style lang="scss" scoped>
.dc-date {
  &-input {
    width: 220px;
  }
  &-panel {
    display: flex;
    border: 1px solid var(--border-color);
    &-table {
      padding: 5px 10px 10px;
    }
    &-table-header {
      display: flex;
      justify-content: space-between;
      span {
        margin: 15px 5px 5px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>
