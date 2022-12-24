<template>
  <DefaultCalendar
    v-model="selectedTimeRange"
    @onClick="getSelectedTimeRange"
    :pickerOptions="pickerOptions"
    :i18n="i18nGlobal"
    timeType="Select"
    format="yyyy-MM-DD HH"
    pickerFormat="HH:mm"
    type="DateTimePicker"
    :selectOptions="selectOptions"
    :disabledDate="disabledDate"
  />
  <h1>{{ t("nearlyWeek") }}</h1>
  <DefaultButton @click="changeLang">change</DefaultButton>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, onUpdated } from "vue";
import { useI18n } from "vue-i18n";
import i18n, { t } from "./locale";
const selectedTimeRange = ref<[Date, Date]>([
  new Date(2000, 10, 10, 10, 14),
  new Date(2000, 10, 11, 12, 24),
]);
// const selectedTimeRange = ref<Date[]>([]);

const i18nGlobal = ref("zh");
const changeLang = () => {
  i18nGlobal.value = i18nGlobal.value === "zh" ? "en" : "zh";
  i18n.global.locale = i18nGlobal.value === "zh" ? "zh" : "en";
};
const pickerOptions = ref([
  {
    text: () => t("nearlyWeek"),
    value: () => {
      const end = new Date().getTime();
      const start = new Date().getTime() - 3600 * 1000 * 24 * 7;
      return [start, end];
    },
  },
]);

const selectOptions = {
  start: "08:30",
  step: "00:15",
  end: "18:30",
};
const getSelectedTimeRange = (val: number[]) => {};
const disabledDate = {
  type: "today",
  range: "2022-11-06 00:00:00",
};
</script>

<style lang="scss" scoped></style>
