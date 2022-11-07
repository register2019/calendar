<template>
	<span class="dc-calendar-header-input">
		<span>
			<DefaultInput
				size="small"
				v-model="inputDate"
				:disabled="inputIsDisabled"
				@blur="onBlur"
			/>
		</span>
		<span>
			<DefaultTimeSelect
				v-if="timeType === 'Select'"
				size="small"
				v-model="inputTime"
				:disabled="inputIsDisabled"
				:selectOptions="selectOptions"
			/>
			<DefaultTimePicker
				v-else
				size="small"
				v-model="inputTime"
				:disabled="inputIsDisabled"
			/>
		</span>
	</span>
</template>

<script lang="ts" setup>
import { ref, useAttrs, watch } from "vue";
import DefaultInput from "../../Input/src/input.vue";
import DefaultTimeSelect from "../../TimeSelect/src/time-select.vue";
import DefaultTimePicker from "../../TimePicker/src/time-picker.vue";
import { SelectOptions } from "../../../utils/timeSelect";

type Props = {
	timeType?: string;
	inputIsDisabled?: boolean;
	date: string;
	time?: string;
};
const props = withDefaults(defineProps<Props>(), {
	timeType: "Picker",
	inputIsDisabled: false,
	date: "",
});

const emit = defineEmits(["update:date", "update:time", "updateInputPosition"]);
const attrs = useAttrs();

const selectOptions = ref<SelectOptions>(attrs.selectOptions as SelectOptions);
const inputDate = ref("");
const inputTime = ref("");

const onBlur = () => {
	emit("updateInputPosition");
};

watch(inputDate, (val) => {
	emit("update:date", val);
});
watch(inputTime, (val) => {
	emit("update:time", val);
});

watch(
	() => props,
	(val) => {
		inputDate.value = val.date;
		inputTime.value = val.time!;
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style lang="scss" scoped>
.dc-calendar-header-input {
	display: table-cell;
	span {
		display: table-cell;
		padding: 0 5px;
	}
}
</style>
