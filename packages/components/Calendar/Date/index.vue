<template>
  <div class="dc-date-input" @click="openPanel">
    <DefaultInput v-model="inputDate" />
  </div>
  <Teleport to="body">
    <div ref="panelRef" class="dc-date-panel" v-show="isShowPanel">
      <!-- <div>侧边栏</div> -->
      <div class="dc-date-panel-table">
        <PanelTable
          :tds="tds"
          type="Date"
          @emit-selected-date="emitSelectedDate"
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
import { onClickOutside } from "@vueuse/core";
import { ref, reactive, watch, computed } from "vue";
import { getCurrPageDays, getTimeUtils, IDate } from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelTable from "../Components/panelTable.vue";

const panelRef = ref();
const isShowPanel = ref(false);

const openPanel = () => {
  isShowPanel.value = true;
};

onClickOutside(panelRef, () => {
  isShowPanel.value = false;
});

const inputDate = ref("");
const emitSelectedDate = (val: IDate) => {
  const { year, month, day } = getTimeUtils(val.timestamp);
  inputDate.value = year + "-" + month + "-" + day;
  isShowPanel.value = false;
};

const { year, month } = getTimeUtils();
const tds = getCurrPageDays(year, Number(month));
</script>

<style lang="scss" scoped>
.dc-date {
  &-input {
    width: 220px;
  }
  &-panel {
    display: flex;
    width: 292px;
    border: 1px solid var(--border-color);
    &-table {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
