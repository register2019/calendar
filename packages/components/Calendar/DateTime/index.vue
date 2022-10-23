<template>
  <div @click="openDialog" class="dc-date-time-input">
    <DefaultInput v-model="selectedDateTime" />
  </div>
  <Teleport to="body">
    <div
      class="dc-date-time-dialog"
      :style="dynamicPanelWidth"
      v-show="isShowPanel"
      ref="DateTimeRef"
    >
      <div class="dc-dialog-layout">
        <PanelSider
          v-if="props.pickerOptions && props.pickerOptions.length !== 0"
          :picker-options="pickerOptions"
          @selected-picker-options="selectedPickerOptions"
        />
        <div class="dc-dialog-layout-content">
          <div class="dc-date-time-dialog-input">
            <PanelInput v-model:date="inputDate" v-model:time="inputTime" />
          </div>
          <div class="dc-date-time-dialog-header">
            <div class="dc-date-time-dialog-header-before">
              <span @click="clickBefore('year')">&lt;&lt; </span>
              <span
                v-show="panelType === 'day'"
                @click="clickBefore('month')"
                style="margin-left: 10px"
                >&lt;</span
              >
            </div>
            <div v-show="panelType === 'day'">
              <span @click="selectYear">{{ currYear }} 年 </span>
              <span @click="selectMonth">{{ timeFormat(currMonth) }} 月 </span>
            </div>
            <div v-show="panelType === 'month'" @click="clickPanelTypeIsMonth">
              {{ currYear }} 年
            </div>
            <div v-show="panelType === 'year'">
              {{ panelTypeIsYearTitle }}
            </div>
            <div class="dc-date-time-dialog-header-after">
              <span
                v-show="panelType === 'day'"
                @click="clickAfter('month')"
                style="margin-right: 10px"
                >&gt;</span
              >
              <span @click="clickAfter('year')">&gt;&gt;</span>
            </div>
          </div>
          <div class="dc-date-time-dialog-table">
            <PanelTable
              v-show="panelType === 'day'"
              :tds="tds"
              type="DateTime"
              :curr-date-time="inputDate"
              @emit-selected-date="emitSelectedDate"
            />
            <div v-show="panelType === 'year'">
              <PanelMonthAndYear
                :dates="nearlyADecade"
                :currDate="currYear"
                @emit-selected-year-or-month="emitSelectedYearOrMonth"
              />
            </div>
            <div v-show="panelType === 'month'">
              <PanelMonthAndYear
                :dates="DATETIMEMONTH"
                :currDate="
                  CASECONVERSION.find((item) => item.val === currMonth)!.name
                "
                @emit-selected-year-or-month="emitSelectedYearOrMonth"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="dc-date-time-dialog-footer">
        <DefaultButton
          size="small"
          type="text"
          style="margin-right: 10px"
          @click="getCurrDateTime"
          >此刻</DefaultButton
        >
        <DefaultButton @click="submitBtn" size="small">确定</DefaultButton>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DateTime",
};
</script>
<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, reactive, watch, onMounted, computed, CSSProperties } from "vue";
import {
  dateTimeYear,
  getCurrPageDays,
  getTimeUtils,
  IDate,
  timeFormat,
} from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelInput from "../Components/panelInput.vue";
import PanelTable from "../Components/panelTable.vue";
import DefaultButton from "../../Button/index.vue";
import { PickerOptions, DATETIMEMONTH, CASECONVERSION } from "../constants";
import PanelSider from "../Components/panelSider.vue";
import PanelMonthAndYear from "../Components/panelMonthAndYear.vue";

const DateTimeRef = ref();
const isShowPanel = ref(false);
const panelType = ref("day");
const dynamicPanelWidth = ref<CSSProperties>({
  width: "322px",
});

type Props = {
  pickerOptions?: PickerOptions[];
};

const props = defineProps<Props>();
const nearlyADecade = ref(dateTimeYear());

const openDialog = () => {
  isShowPanel.value = true;
  if (props.pickerOptions) {
    dynamicPanelWidth.value.width = "432px";
  }
};
onClickOutside(DateTimeRef, () => {
  isShowPanel.value = false;
});

const { year, month } = getTimeUtils();
const tds = ref<IDate[][]>([]);
const currYear = ref(year);
const currMonth = ref(Number(month));
const selectedDateTime = ref("");

const inputDate = ref("");
const inputTime = ref();
const getTableData = (year: number, month: number) => {
  for (let i = 0; i < 6; i++) {
    tds.value[i] = [];
  }
  let i = 0;
  getCurrPageDays(year, month).forEach((td, index) => {
    if ((index + 1) % 7 === 0) {
      tds.value[i].push(td);
      i++;
    } else {
      tds.value[i].push(td);
    }
  });
};
/**
 * 获取之前的日期
 * @param category
 */
const clickBefore = (category: string) => {
  if (panelType.value === "day" || panelType.value === "month") {
    if (category === "year") {
      currYear.value--;
    } else {
      if (currMonth.value === 1) {
        currYear.value--;
        currMonth.value = 12;
      } else {
        currMonth.value--;
      }
    }
  } else {
    nearlyADecade.value = dateTimeYear(nearlyADecade.value.flat()[0] - 10);
  }

  getTableData(currYear.value, currMonth.value);
};
/**
 * 后去之后的日期
 * @param category
 */
const clickAfter = (category: string) => {
  if (panelType.value === "day" || panelType.value === "month") {
    if (category === "year") {
      currYear.value++;
    } else {
      if (currMonth.value === 12) {
        currYear.value++;
        currMonth.value = 1;
      } else {
        currMonth.value++;
      }
    }
  } else {
    nearlyADecade.value = dateTimeYear(nearlyADecade.value.flat()[0] + 10);
  }
  getTableData(currYear.value, currMonth.value);
};
const selectYear = () => {
  panelType.value = "year";
};
const selectMonth = () => {
  panelType.value = "month";
};

const emitSelectedDate = (val: IDate) => {
  const { year, month, day, hour, minu, seco } = getTimeUtils(val.timestamp);
  inputDate.value = year + "-" + month + "-" + day;
  inputTime.value = hour + ":" + minu + ":" + seco;
};
const emitSelectedYearOrMonth = (val: number) => {
  if (val > 0 && val <= 12) {
    getTableData(currYear.value, val);
    currMonth.value = val;
    panelType.value = "day";
  } else {
    getTableData(val, currMonth.value);
    currYear.value = val;
    panelType.value = "month";
  }
};
const panelTypeIsYearTitle = computed(() => {
  return (
    nearlyADecade.value.flat()[0] +
    "年 -" +
    nearlyADecade.value.flat()[1] +
    "年"
  );
});
const clickPanelTypeIsMonth = () => {
  panelType.value = "year";
};
const selectedPickerOptions = (val: PickerOptions) => {
  const { year, month, day, hour, minu, seco } = getTimeUtils(
    val.value() as number
  );
  inputDate.value = year + "-" + month + "-" + day;
  inputTime.value = hour + ":" + minu + ":" + seco;
  if (year !== currYear.value || Number(month) !== currMonth.value) {
    getTableData(year, Number(month));
    currYear.value = year;
    currMonth.value = Number(month);
  }
};
const getCurrDateTime = () => {
  panelType.value = "day";
  const { year, month, day, hour, minu, seco } = getTimeUtils();
  inputDate.value = year + "-" + month + "-" + day;
  inputTime.value = hour + ":" + minu + ":" + seco;
  if (year !== currYear.value || Number(month) !== currMonth.value) {
    getTableData(year, Number(month));
    currYear.value = year;
    currMonth.value = Number(month);
  }
};
const submitBtn = () => {
  if (inputDate.value && inputTime.value) {
    selectedDateTime.value = inputDate.value + " " + inputTime.value;
  }
  panelType.value = "day";
  isShowPanel.value = false;
};

getTableData(currYear.value, currMonth.value);
</script>
<style lang="scss" scoped>
.dc-date-time {
  &-input {
    width: 220px;
  }
  &-dialog {
    border: 1px solid #ebeefa;
    &-input {
      padding: 10px 6px;
      border-bottom: 1px solid #ebeefa;
    }
    &-header {
      display: flex;
      justify-content: space-between;
      margin: 10px 15px;
      cursor: pointer;
      user-select: none;
    }
    &-table {
      display: flex;
      justify-content: center;
    }
    &-footer {
      display: flex;
      justify-content: end;
      border-top: 1px solid #ebeefa;
      padding: 10px 15px;
    }
  }
}
.dc-dialog-layout {
  display: flex;
}
</style>
