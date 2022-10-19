<template>
  <div @click="openDialog" class="dc-date-time-input">
    <DefaultInput v-model="selectedDateTime" />
  </div>
  <Teleport to="body">
    <div class="dc-date-time-dialog" v-show="isShowPanel" ref="DateTimeRef">
      <div class="dc-date-time-dialog-input">
        <PanelInput v-model:date="inputDate" v-model:time="inputTime" />
      </div>

      <div class="dc-date-time-dialog-header">
        <div class="dc-date-time-dialog-header-before">
          <span @click="clickBefore('year')">&lt;&lt; </span>
          <span @click="clickBefore('month')" style="margin-left: 10px"
            >&lt;</span
          >
        </div>
        <div>{{ headerDateTime }}</div>
        <div class="dc-date-time-dialog-header-after">
          <span @click="clickAfter('month')" style="margin-right: 10px"
            >&gt;</span
          >
          <span @click="clickAfter('year')">&gt;&gt;</span>
        </div>
      </div>
      <div class="dc-date-time-dialog-table">
        <PanelTable
          :tds="tds"
          panel-type="DateTime"
          :curr-date-time="inputDate"
          @emit-selected-date="emitSelectedDate"
        />
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
import { ref, reactive, watch, onMounted, computed } from "vue";
import {
  getCurrPageDays,
  getTimeUtils,
  IDate,
  timeFormat,
} from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelInput from "../Components/panelInput.vue";
import PanelTable from "../Components/panelTable.vue";
import DefaultButton from "../../Button/index.vue";

const DateTimeRef = ref();
const isShowPanel = ref(false);

const openDialog = () => {
  isShowPanel.value = true;
};
onClickOutside(DateTimeRef, () => {
  isShowPanel.value = false;
});

const { year, month } = getTimeUtils();
const tds = ref<IDate[][]>([]);
const currYear = ref(year);
const currMonth = ref(Number(month));
const selectedDateTime = ref("");

const headerDateTime = ref("");
const inputDate = ref("");
const inputTime = ref();
const getTableData = (year: number, month: number) => {
  headerDateTime.value = year + " 年 " + "  " + timeFormat(month) + " 月 ";
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
  getTableData(currYear.value, currMonth.value);
};
/**
 * 后去之后的日期
 * @param category
 */
const clickAfter = (category: string) => {
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
  getTableData(currYear.value, currMonth.value);
};

const emitSelectedDate = (val: IDate) => {
  const { year, month, day, hour, minu, seco } = getTimeUtils(val.timestamp);
  inputDate.value = year + "-" + month + "-" + day;
  inputTime.value = hour + ":" + minu + ":" + seco;
};
const getCurrDateTime = () => {
  const { year, month, day, hour, minu, seco } = getTimeUtils();
  inputDate.value = year + "-" + month + "-" + day;
  inputTime.value = hour + ":" + minu + ":" + seco;
};
const submitBtn = () => {
  selectedDateTime.value = inputDate.value + " " + inputTime.value;
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
    width: 322px;
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
</style>
