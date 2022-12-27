<template>
	<DefaultCalendar
		v-model="defaultValue"
		type="Date"
		:theme="themeGlobal"
		:i18n="i18nGlobal"
		:pickerOptions="pickerOptions"
		@onClick="getSelectedDate"
	/>
	<DefaultButton @click="changeLang">change</DefaultButton>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import i18n from "../locale";
const defaultValue = ref(new Date(2000, 10, 10));
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
const themeGlobal = ref("light");
const i18nGlobal = ref("zh");
const changeLang = () => {
	themeGlobal.value = themeGlobal.value === "dark" ? "light" : "dark";

	i18nGlobal.value = i18nGlobal.value === "zh" ? "en" : "zh";
	i18n.global.locale = i18nGlobal.value === "zh" ? "zh" : "en";
};
const getSelectedDate = (val: number) => {
	console.log(val);
};
</script>

<style lang="scss" scoped></style>
