<template>
	<DefaultCalendar
		v-model="selectedTimeRange"
		@onClick="getSelectedTimeRange"
		:pickerOptions="pickerOptions"
		timeType="Picker"
		type="DateTimePicker"
		:selectOptions="selectOptions"
		:disabledDate="disabledDate"
	/>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
// const selectedTimeRange = ref<Date[]>([]);
const selectedTimeRange = ref<[Date, Date]>([
	new Date(2000, 10, 10, 10, 14),
	new Date(2000, 10, 11, 12, 24),
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
const selectOptions = {
	start: "08:30",
	step: "00:15",
	end: "18:30",
};
const getSelectedTimeRange = (val: number[]) => {
	console.log(val);
};
const disabledDate = {
	type: "today",
	range: "2022-11-06 00:00:00",
};
</script>

<style lang="scss" scoped></style>
