<template>
  <DefaultCalendar
    v-model="defaultValue"
    type="DatePicker"
    :picker-options="pickerOptions"
    @onClick="getSelectedDate"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
const defaultValue = ref<Date[]>([
  new Date(2000, 10, 10),
  new Date(2000, 10, 11),
]);
const pickerOptions = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date().getTime();
      const start = new Date().getTime() - 3600 * 1000 * 24 * 7;

      return [start, end];
    },
  },
];

const getSelectedDate = (val: number[]) => {
  console.log(val);
};
const disabledDate = {
  type: "before",
  range: "2022-11-06 00:00:00",
};
</script>

<style lang="scss" scoped></style>
