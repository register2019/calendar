<template>
  <DefaultCalendar
    v-model="selectedTimeRange"
    @onClick="getSelectedTimeRange"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
const selectedTimeRange = ref<number[]>([]);

const getSelectedTimeRange = (val: number[]) => {
  console.log(val);
};
</script>

<style lang="scss" scoped></style>
