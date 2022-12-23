<template>
	<DefaultCalendar
		v-model="defaultValue"
		type="Date"
		:i18n="i18n"
		:pickerOptions="pickerOptions"
		@onClick="getSelectedDate"
	/>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
const defaultValue = ref(new Date(2000, 10, 10));
const i18n = ref("en");
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

const getSelectedDate = (val: number) => {
	console.log(val);
};
</script>

<style lang="scss" scoped></style>
