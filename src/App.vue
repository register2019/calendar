<template>
  <Calendar />
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import Calendar from "./page/calendar.vue";
import TimePicker from "./components/TimePicker/index.vue";
</script>

<style lang="scss" scoped></style>
