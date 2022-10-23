<template>
  <DefaultCalendar type="DateTime" />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
const pickerOptions = [
  {
    text: "今天",
    value: () => new Date().getTime(),
  },
  {
    text: "昨天",
    value: () => new Date().getTime() - 3600 * 1000 * 24,
  },
  {
    text: "一周前",
    value: () => new Date().getTime() - 3600 * 1000 * 24 * 7,
  },
];
</script>

<style lang="scss" scoped></style>
