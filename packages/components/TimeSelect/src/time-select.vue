<template>
	<div>
		<DefaultInput
			:size="size"
			v-model="currSelectedTime"
			@click="openTimeSelectPanel"
		/>
		<div v-show="isShowTimeSelectPanel" ref="timeSelectRef" class="time-select">
			<div
				v-for="(item, index) in initTimeSelectPanel(pickerOptions)"
				:key="index"
				:class="['time-select-item', initSelectedTimeStyle(item)]"
				@click="selectTime(item)"
			>
				{{ item }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: "DefaultTimeSelect",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import DefaultInput from "../../Input/src/input.vue";
import { onClickOutside } from "@vueuse/core";
import { initTimeSelectPanel, PickerOptions } from "../../../utils/timeSelect";

type Props = {
	modelValue?: string;
	pickerOptions?: PickerOptions;
	size?: string;
};

const emit = defineEmits(["update:modelValue"]);
const { pickerOptions } = withDefaults(defineProps<Props>(), {
	pickerOptions: (): PickerOptions => ({
		start: "08:30",
		step: "00:13",
		end: "18:30",
	}),
});

const isShowTimeSelectPanel = ref(false);
const timeSelectRef = ref();

const openTimeSelectPanel = () => {
	isShowTimeSelectPanel.value = true;
};

onClickOutside(timeSelectRef, () => {
	isShowTimeSelectPanel.value = false;
});

const currSelectedTime = ref("08:30");
const selectTime = (time: string) => {
	currSelectedTime.value = time;
	emit("update:modelValue", currSelectedTime.value);
	isShowTimeSelectPanel.value = false;
};
const initSelectedTimeStyle = (val: string) => {
	if (currSelectedTime.value === val) {
		return "currSelectedTimeStyle";
	}
	return "";
};
</script>
<style lang="scss" scoped>
.time-select {
	position: absolute;
	background-color: #fff;
	height: 200px;
	min-width: 140px;
	overflow: auto;
	border: 1px solid #d3d3d3;
	border-radius: 5px;
	&-item {
		padding: 8px 10px;
		font-size: 14px;
		line-height: 20px;
		cursor: pointer;
	}
	&-item:hover {
		background-color: #f5f7fa;
		font-weight: 700;
	}
}
.time-select::-webkit-scrollbar {
	position: absolute;
	width: 10px;
	z-index: 10;
}
.time-select::-webkit-scrollbar-thumb {
	background-color: #eeeeee;
	border: 1px solid #fff;
	border-radius: 5px;
}

.currSelectedTimeStyle {
	color: #409eff;
	font-weight: 700;
}
</style>
