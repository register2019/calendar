<template>
  <div @click="openDialog" class="dc-date-time-input">
    <DefaultInput />
  </div>
  <Teleport to="body">
    <div class="dc-date-time-dialog" v-show="isShowPanel" ref="DateTimeRef">
      <PanelInput />
      <div class="dc-date-time-dialog-header">
        <div class="dc-date-time-dialog-header-left">
          <span>&lt;&lt; </span>
          <span>&lt;</span>
        </div>
        <div></div>
        <div class="dc-date-time-dialog-header-right">
          <span>&gt;</span>
          <span>&gt;&gt;</span>
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

const getTableData = () => {
  let i = 0;
  getCurrPageDays(year, Number(month)).forEach((td, index) => {
    if ((index + 1) % 7 === 0) {
      tds.value[i].push(td);
      i++;
    } else {
      tds.value[i].push(td);
    }
  });
};
getTableData();
</script>
<style lang="scss" scoped>
.dc-date-time {
  &-input {
    width: 220px;
  }
  &-dialog {
    width: 322px;
    border: 1px solid #ebeefa;
    &-header {
      display: flex;
      justify-content: space-between;
      &-left,
      &-right {
      }
    }
    &-table {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
