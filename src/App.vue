<template>
  <DefaultCalendar
    v-model="selectedTimeRange"
    @onClick="getSelectedTimeRange"
    :pickerOptions="pickerOptions"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
// const selectedTimeRange = ref<[Date, Date]>([
//   new Date(2000, 10, 10, 10, 10),
//   new Date(2000, 10, 11, 10, 10),
// ]);
const selectedTimeRange = ref<Date[]>([]);
const pickerOptions = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date().getTime() + 3600 * 1000 * 24 * 90;
      const start = new Date().getTime();

      return [start, end];
    },
  },
];
const getSelectedTimeRange = (val: number[]) => {
  // console.log(val);
};
</script>

<style lang="scss" scoped></style>
