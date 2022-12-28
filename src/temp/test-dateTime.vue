<template>
	<div>
		<DefaultCalendar
			v-model="defaultValue"
			type="DateTime"
			:i18n="i18nGlobal"
			:theme="themeGlobal"
			format="yyyy-MM-DD HH"
			pickerFormat="HH"
			timeType="Select"
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
const defaultValue = ref(new Date(2000, 10, 10, 8, 30));
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

const i18nGlobal = ref("zh");
const themeGlobal = ref("dark");
const changeLang = () => {
	themeGlobal.value = themeGlobal.value === "dark" ? "light" : "dark";

	// i18nGlobal.value = i18nGlobal.value === "zh" ? "en" : "zh";
	// i18n.global.locale = i18nGlobal.value === "zh" ? "zh" : "en";
};
</script>

<style lang="scss" scoped></style>
