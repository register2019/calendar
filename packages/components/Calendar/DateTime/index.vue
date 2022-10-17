<template>
  <div @click="openDialog" class="dc-date-time-input">
    <DefaultInput />
  </div>
  <Teleport to="body">
    <div class="dc-date-time-dialog" v-show="isShowPanel" ref="DateTimeRef">
      <div class="dc-date-time-dialog-input">
        <PanelInput />
      </div>

      <div class="dc-date-time-dialog-header">
        <div class="dc-date-time-dialog-header-before">
          <span class="dc-date-time-dialog-header-before-year">&lt;&lt; </span>
          <span class="dc-date-time-dialog-header-before-month">&lt;</span>
        </div>
        <div>{{ headerDateTime }}</div>
        <div class="dc-date-time-dialog-header-after">
          <span class="dc-date-time-dialog-header-after-month">&gt;</span>
          <span class="dc-date-time-dialog-header-after-year">&gt;&gt;</span>
        </div>
      </div>
      <div class="dc-date-time-dialog-table">
        <PanelTable :tds="tds" />
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
import { getCurrPageDays, getTimeUtils, IDate } from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelInput from "../Components/panelInput.vue";
import PanelTable from "../Components/panelTable.vue";

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
for (let i = 0; i < 6; i++) {
  tds.value[i] = [];
}

const headerDateTime = ref("");
const getTableData = (year: number, month: number) => {
  headerDateTime.value = year + " 年 " + "  " + month + " 月 ";
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
getTableData(year, Number(month));
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
      &-before-month {
        margin-left: 10px;
      }
      &-after-month {
        margin-right: 10px;
      }
    }
    &-table {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
