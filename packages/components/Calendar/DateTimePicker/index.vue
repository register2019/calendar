<template>
	<div @click="openCalendar" class="dc-calendar-input" ref="calendarInput">
		<input type="text" class="dc-input" v-model="startDateTime" />
		<span>{{ props.rangeSeparator }}</span>
		<input type="text" class="dc-input" v-model="endDateTime" />
	</div>
	<Teleport to="body">
		<div
			class="dc-calendar"
			:style="calendarStyle"
			v-show="calendarPanel"
			ref="calendarRef"
		>
			<div style="display: flex; border-bottom: 1px solid #ebeef5">
				<PanelSider
					v-if="props.pickerOptions && props.pickerOptions.length !== 0"
					:pickerOptions="props.pickerOptions"
					@selected-picker-options="selectedPickerOptions"
				/>
				<div>
					<div class="dc-calendar-header">
						<PanelInput
							v-model:date="panelStartDate"
							v-model:time="panelStartTime"
							:inputIsDisabled="inputIsDisabled"
							:timeType="props.timeType"
							@update-input-position="updateInputPosition"
							v-bind="$attrs"
						/>
						<span class="dc-calendar-header-separator">&gt;</span>
						<PanelInput
							v-model:date="panelEndDate"
							v-model:time="panelEndTime"
							:inputIsDisabled="inputIsDisabled"
							:timeType="props.timeType"
							@update-input-position="updateInputPosition"
							v-bind="$attrs"
						/>
					</div>
					<PickerComponents
						:modelValue="props.modelValue"
						:pickerOptions="props.pickerOptions"
						:selectedDateList="selectedDateList"
						v-bind="$attrs"
						@date-range="getDateRange"
						@isCompleteSelection="computedSelection"
					/>
				</div>
			</div>

			<div class="dc-calendar-footer">
				<DefaultButton type="text" size="small" @click="cancelBtn">
					取消
				</DefaultButton>
				<DefaultButton size="small" @click="submitBtn"> 确定 </DefaultButton>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts">
export default {
	name: "DateTimePicker",
};
</script>
<script lang="ts" setup>
import { ref, CSSProperties, useAttrs } from "vue";
import { onClickOutside, useElementBounding } from "@vueuse/core";
import {
	dateFormat,
	dateTimeFormat,
	initCalendarPanel,
	dateToTimeStamp,
	determineTheDateFormat,
} from "../../../utils";
import PanelInput from "../Components/panelInput.vue";
import PanelSider from "../Components/panelSider.vue";
import PickerComponents from "../Components/picker-components.vue";
import DefaultButton from "../../Button/index.vue";
import { PickerOptions, SelectedDateList } from "../constants";

const calendarPanel = ref(false);
const calendarRef = ref();

const startDateTime = ref<string>();
const endDateTime = ref<string>();

const selectedDateList = ref<SelectedDateList[]>([]);

const calendarInput = ref(null);
const calendarStyle = ref<CSSProperties>({
	position: "absolute",
	top: "",
	left: "",
	width: "646px",
});

onClickOutside(calendarRef, () => {
	calendarPanel.value = false;
	isSelectedDateRange.value = false;
});

type Props = {
	modelValue?: Date[];
	timeType?: string; // 默认是Picker 可选值为Picker和Select
	pickerOptions?: PickerOptions[];
	rangeSeparator?: string;
};
const props = withDefaults(defineProps<Props>(), {
	modelValue: (): Date[] => [],
	timeType: "Picker",
	rangeSeparator: "至",
});

const emit = defineEmits(["update:modelValue", "onClick"]);

if (props.pickerOptions && props.pickerOptions.length > 0) {
	calendarStyle.value.width = "782px";
}

let panelStartDate = ref();
let panelEndDate = ref();

// 是否完成选择
const inputIsDisabled = ref(false);

const panelStartTime = ref();
const panelEndTime = ref();
const attrs = useAttrs();

const initSelectedDateList = (val: number[]) => {
	selectedDateList.value = [];
	val.forEach((item) => {
		selectedDateList.value.push({
			val: item,
			category: "click",
		});
	});
};
const computedSelection = (val: boolean) => {
	inputIsDisabled.value = !val;
};
/**
 * 点击侧边栏
 * @param val
 */
const selectedPickerOptions = (val: PickerOptions) => {
	const target = val.value() as number[];
	panelStartDate.value = dateFormat(target[0]);
	panelEndDate.value = dateFormat(target[1]);
	initSelectedDateList(target);
};

const getDateRange = (params: number[]) => {
	panelStartDate.value = dateFormat(params[0]);
	panelEndDate.value = dateFormat(params[1]);
	if (props.timeType === "Select") {
		panelStartTime.value = "00:00";
		panelEndTime.value = "00:00";
	} else {
		panelStartTime.value = "00:00:00";
		panelEndTime.value = "00:00:00";
	}
	initSelectedDateList(params);
};

// 是否是点击日历面板选择日期 主要用于区别输入框修改日期 日历面板更新的情况
const isSelectedDateRange = ref(false);

const openCalendar = () => {
	const {
		top: inputTop,
		left: inputLeft,
		height: inputHeight,
		bottom: inputBottom,
	} = useElementBounding(calendarInput);
	const { height: panelHeight } = useElementBounding(calendarRef);
	if (inputBottom.value > panelHeight.value) {
		calendarStyle.value.top = inputTop.value + inputHeight.value + 10 + "px";
	} else {
		calendarStyle.value.top = inputTop.value - panelHeight.value - 10 + "px";
	}
	calendarStyle.value.left = inputLeft.value + "px";

	calendarPanel.value = true;
};

const updateInputPosition = () => {
	const startTimeStamp = dateToTimeStamp(
		panelStartDate.value + " " + panelStartTime.value
	);
	const endTimeStamp = dateToTimeStamp(
		panelEndDate.value + " " + panelEndTime.value
	);

	if (
		!determineTheDateFormat(panelStartDate.value) ||
		!determineTheDateFormat(panelEndDate.value)
	)
		return;
	initSelectedDateList([startTimeStamp, endTimeStamp].sort((a, b) => a - b));

	panelStartDate.value = dateFormat(selectedDateList.value[0].val);
	panelEndDate.value = dateFormat(selectedDateList.value[1].val);
};

if (props.modelValue && props.modelValue.length === 2) {
	initSelectedDateList([
		dateToTimeStamp(props.modelValue[0]),
		dateToTimeStamp(props.modelValue[1]),
	]);

	// 有默认时间
	startDateTime.value = dateTimeFormat(props.modelValue[0], props.timeType);
	endDateTime.value = dateTimeFormat(props.modelValue[1], props.timeType);
	const { leftHour, leftMinu, leftSeco, rightHour, rightMinu, rightSeco } =
		initCalendarPanel(props.modelValue);

	// 初始化时间
	if (props.timeType === "Picker") {
		panelStartTime.value = leftHour + ":" + leftMinu + ":" + leftSeco;
		panelEndTime.value = rightHour + ":" + rightMinu + ":" + rightSeco;
	} else {
		panelStartTime.value = leftHour + ":" + leftMinu;
		panelEndTime.value = rightHour + ":" + rightMinu;
	}

	// initSelectedDateTimeRange(props.modelValue);
} else {
	// 没有默认时间
}

const cancelBtn = () => {
	calendarPanel.value = false;
	isSelectedDateRange.value = false;
};

const submitBtn = () => {
	startDateTime.value =
		dateFormat(selectedDateList.value[0].val) + " " + panelStartTime.value;

	endDateTime.value =
		dateFormat(selectedDateList.value[1].val) + " " + panelEndTime.value;

	calendarPanel.value = false;

	emit("onClick", [
		dateToTimeStamp(startDateTime.value),
		dateToTimeStamp(endDateTime.value),
	]);
	isSelectedDateRange.value = false;
};
</script>

<style lang="scss" scoped>
$common-border: 1px solid #ebeef5;
.dc-input {
	outline: none;
	border: none;
}
.dc-table {
	min-width: 291px;
	border-spacing: 0 10px !important;

	.dc-td {
		text-align: center;
		cursor: pointer;
		height: 38px;
		width: 38px;
		font-size: 12px;
	}
}

.dc-calendar-input {
	border: 1px solid #dcdfe6;
	padding: 5px;
	min-width: 320px;
	display: inline-flex;

	span {
		margin: 0 15px;
	}
}

.dc-calendar {
	border: $common-border;
	background-color: #fff;

	&-header {
		padding: 5px;
		display: table;
		&-separator {
			margin: 0 10px 0 15px;
		}
	}

	&-footer {
		display: flex;
		justify-content: right;
		margin: 10px;
	}
}

.dc-calendar-content-left-top-icon,
.dc-calendar-content-right-top-icon {
	cursor: pointer;
	user-select: none;
}
</style>
