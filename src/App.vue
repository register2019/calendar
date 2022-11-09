<template>
	<div>
		<DefaultCalendar
			v-model="defaultValue"
			type="DateTime"
			format="yyyy-MM-DD HH"
			pickerFormat="HH"
			:picker-options="pickerOptions"
			:selectOptions="selectOptions"
			:disabledDate="disabledDate"
			@onClick="getSelectedTime"
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
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
</script>

<style lang="scss" scoped></style>
