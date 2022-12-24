<template>
  <div>
    <DefaultCalendar
      v-model="defaultValue"
      type="DateTime"
      timeType="Select"
      :i18n="i18nGlobal"
      format="yyyy-MM-DD HH"
      pickerFormat="yyyy-MM-DD HH"
      :picker-options="pickerOptions"
      :selectOptions="selectOptions"
      :disabledDate="disabledDate"
      @onClick="getSelectedTime"
    />
    <DefaultButton @click="changeLang">change</DefaultButton>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import i18n, { t } from "./locale";
const defaultValue = ref(new Date(2000, 10, 10, 8, 30));
const pickerOptions = [
  {
    text: "today",
    value: () => new Date().getTime(),
  },
  {
    text: () => t("yestorday"),
    value: () => new Date().getTime() - 3600 * 1000 * 24,
  },
  {
    text: () => t("beforeWeek"),
    value: () => new Date().getTime() - 3600 * 1000 * 24 * 7,
  },
];
const selectOptions = {
  start: "08:00",
  step: "00:15",
  end: "18:30",
};
const i18nGlobal = ref("zh");
const changeLang = () => {
  i18nGlobal.value = i18nGlobal.value === "zh" ? "en" : "zh";
  i18n.global.locale = i18nGlobal.value === "zh" ? "zh" : "en";
};
const getSelectedTime = (val: number) => {
  console.log(val);
};
const disabledDate = {
  type: "range",
  range: ["2022-11-06 00:00:00", "2022-11-16 00:00:00"],
};
</script>

<style lang="scss" scoped></style>
