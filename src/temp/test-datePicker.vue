<template>
	<div>
		<DefaultCalendar
			type="DatePicker"
			inputSize="normal"
			:theme="themeGlobal"
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
import i18n from "../locale";
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
const selectOptions = {
	start: "08:00",
	step: "00:15",
	end: "18:30",
};
const getSelectedTime = (val: number) => {
	console.log(val);
};
const disabledDate = {
	type: "range",
	range: ["2022-11-06 00:00:00", "2022-11-16 00:00:00"],
};

const themeGlobal = ref("dark");
const i18nGlobal = ref("zh");
const changeLang = () => {
	themeGlobal.value = themeGlobal.value === "dark" ? "light" : "dark";

	// i18nGlobal.value = i18nGlobal.value === "zh" ? "en" : "zh";
	// i18n.global.locale = i18nGlobal.value === "zh" ? "zh" : "en";
};
</script>

<style lang="scss" scoped></style>
