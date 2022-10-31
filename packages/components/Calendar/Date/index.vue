<template>
  <div class="date-input" @click="openPanel">
    <DefaultInput />
  </div>
  <Teleport to="body">
    <div ref="panelRef" class="date-panel" v-show="isShowPanel">
      <PanelTable :tds="tds" />
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
import { getCurrPageDays, getTimeUtils } from "../../../utils";
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

const { year, month } = getTimeUtils();
const tds = getCurrPageDays(year, Number(month));
</script>

<style lang="scss" scoped>
.date {
  &-input {
    width: 220px;
  }
  &-panel {
    border: 1px solid var(--border-color);
  }
}
</style>
