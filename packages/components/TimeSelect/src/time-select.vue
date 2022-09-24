<template>
	<div>
		<DefaultInput
			:size="size"
			v-model="currSelectedTime"
			@click="openTimeSelectPanel"
			ref="timeSelectInputRef"
		/>
		<div
			v-show="isShowTimeSelectPanel"
			ref="timeSelectRef"
			class="dc-time-select"
		>
			<div
				v-for="(item, index) in initTimeSelectPanel(pickerOptions)"
				:key="index"
				:class="['dc-time-select-item', initSelectedTimeStyle(item)]"
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
import { onClickOutside, useElementBounding } from "@vueuse/core";
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

// 获取time-select输入框的size
const timeSelectInputRef = ref(null);
// 动态设置time-select-panel的宽度
const timeSelectPanelWidth = ref("");
const openTimeSelectPanel = () => {
	isShowTimeSelectPanel.value = true;
	const { width } = useElementBounding(timeSelectInputRef);
	timeSelectPanelWidth.value = width.value + "px";
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
		return "dc-currSelectedTimeStyle";
	}
	return "";
};
</script>
<style lang="scss" scoped>
.dc {
	&-time-select {
		position: absolute;
		background-color: #fff;
		height: 200px;
		min-width: 140px;
		width: v-bind(timeSelectPanelWidth);
		overflow: overlay; // 设置滚动条位于hover效果的上方
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
	&-time-select::-webkit-scrollbar {
		width: 6px;
		display: block;
	}
	&-time-select:hover::-webkit-scrollbar {
		display: block;
	}
	&-time-select::-webkit-scrollbar-thumb {
		background-color: #eeeeee;
		width: 5px;
		border-radius: 5px;
		border-right: 1px solid #fff;
	}
	&-currSelectedTimeStyle {
		color: #409eff;
		font-weight: 700;
	}
}
</style>