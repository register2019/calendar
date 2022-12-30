<template>
	<div @click="openDialog" class="dc-date-time-input" ref="dateTimeInputRef">
		<DefaultInput :size="props.inputSize" v-model="selectedDateTime" />
	</div>
	<Teleport to="body">
		<div
			:class="['dc-date-time-dialog', `dc-date-time-dialog-${props.theme}`]"
			:style="dynamicPanelWidth"
			v-show="isShowPanel"
			ref="DateTimeRef"
		>
			<div class="dc-dialog-layout">
				<PanelSider
					v-if="props.pickerOptions && props.pickerOptions.length !== 0"
					:picker-options="pickerOptions"
					@selected-picker-options="selectedPickerOptions"
				/>
				<div class="dc-dialog-layout-content">
					<div class="dc-date-time-dialog-input">
						<PanelInput
							v-bind="$attrs"
							v-model:date="inputDate"
							v-model:time="inputTime"
							:timeType="props.timeType"
						/>
					</div>
					<div
						:class="['dc-date-time-dialog-header', `border-top-${props.theme}`]"
					>
						<div class="dc-date-time-dialog-header-before">
							<span @click="clickBefore('year')">&lt;&lt; </span>
							<span
								v-show="panelType === 'day'"
								@click="clickBefore('month')"
								style="margin-left: 10px"
								>&lt;</span
							>
						</div>
						<div v-show="panelType === 'day'">
							<span @click="selectYear">{{ i18nCurrDate.year }}</span>
							<span @click="selectMonth">{{ i18nCurrDate.month }} </span>
						</div>
						<div v-show="panelType === 'month'" @click="clickPanelTypeIsMonth">
							{{ i18nCurrDate.year }}
						</div>
						<div v-show="panelType === 'year'">
							{{ panelTypeIsYearTitle }}
						</div>
						<div class="dc-date-time-dialog-header-after">
							<span
								v-show="panelType === 'day'"
								@click="clickAfter('month')"
								style="margin-right: 10px"
								>&gt;</span
							>
							<span @click="clickAfter('year')">&gt;&gt;</span>
						</div>
					</div>
					<div class="dc-date-time-dialog-table">
						<PanelTable
							v-show="panelType === 'day'"
							:tds="tds"
							type="DateTime"
							:i18n="props.i18n"
							:curr-date-time="inputDate"
							@emit-selected-date="emitSelectedDate"
							v-bind="$attrs"
						/>
						<div v-show="panelType === 'year'">
							<PanelMonthAndYear
								:dates="nearlyADecade"
								:currDate="currYear"
								@emit-selected-year-or-month="emitSelectedYearOrMonth"
							/>
						</div>
						<div v-show="panelType === 'month'">
							<PanelMonthAndYear
								:dates="i18nDATETIMEMONTH"
								:i18n="props.i18n"
								:currDate="
                  i18nDATETIMEMONTH.flat().find((item) => item.val === currMonth)![props.i18n]
                "
								@emit-selected-year-or-month="emitSelectedYearOrMonth"
							/>
						</div>
					</div>
				</div>
			</div>
			<div :class="['dc-date-time-dialog-footer', `border-top-${props.theme}`]">
				<DefaultButton
					size="small"
					type="text"
					style="margin-right: 10px"
					@click="getCurrDateTime"
					>{{ i18nFooterBtn.now[props.i18n] }}</DefaultButton
				>
				<DefaultButton @click="submitBtn" size="small">{{
					i18nFooterBtn.submit[props.i18n]
				}}</DefaultButton>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts">
export default {
	name: "DateTime",
};
</script>
<script lang="ts" setup>
import {
	onClickOutside,
	useElementBounding,
	useWindowSize,
} from "@vueuse/core";
import { ref, computed, CSSProperties, useAttrs, watch } from "vue";
import {
	dateTimeYear,
	dateToTimeStamp,
	getCurrPageDays,
	getTimeUtils,
	IDate,
	timeFormat,
	i18nMonths,
	i18nDATETIMEMONTH,
	i18nFooterBtn,
	global,
} from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PanelInput from "../Components/panelInput.vue";
import PanelTable from "../Components/panelTable.vue";
import DefaultButton from "../../Button/index.vue";
import { PickerOptions } from "../constants";
import PanelSider from "../Components/panelSider.vue";
import PanelMonthAndYear from "../Components/panelMonthAndYear.vue";

const DateTimeRef = ref();
const isShowPanel = ref(false);
const panelType = ref("day");
const dynamicPanelWidth = ref<CSSProperties>({
	width: "322px",
	position: "absolute",
	top: "",
	left: "",
});

type Props = {
	format?: string;
	pickerOptions?: PickerOptions[];
	modelValue?: Date;
	timeType?: string;
	i18n?: string;
	theme?: string;
	inputSize?: string;
};

const props = withDefaults(defineProps<Props>(), {
	timeType: "Picker",
	format: "yyyy-MM-DD HH:mm:ss",
	pickerFormat: "HH:mm:ss",
	i18n: "zh",
	theme: "light",
	inputSize: "normal",
});

watch(
	() => props.theme,
	(val) => {
		global.theme = val;
	},
	{
		immediate: true,
	}
);

const emit = defineEmits(["onClick"]);
const nearlyADecade = ref(dateTimeYear());
const dateTimeInputRef = ref();
const attrs = useAttrs();

const getTableData = (year: number, month: number) => {
	tds.value = getCurrPageDays(year, month);
};

const openDialog = () => {
	isShowPanel.value = true;
	if (props.pickerOptions) {
		dynamicPanelWidth.value.width = "432px";
	}
	const { height: panelHeight } = useElementBounding(DateTimeRef);
	const {
		bottom: inputBottom,
		left: inputLeft,
		top: inputTop,
	} = useElementBounding(dateTimeInputRef);
	const { width: browserWidth, height: browserHeight } = useWindowSize();

	if (inputBottom.value + panelHeight.value <= browserHeight.value) {
		dynamicPanelWidth.value.top = inputBottom.value + 10 + "px";
		dynamicPanelWidth.value.left = inputLeft.value + "px";
	} else {
		dynamicPanelWidth.value.top =
			inputTop.value - panelHeight.value - 10 + "px";
		dynamicPanelWidth.value.left = inputLeft.value + "px";
	}

	const midSelectedDateTime =
		props.format === "yyyy-MM-DD HH"
			? selectedDateTime.value + ":00"
			: selectedDateTime.value;

	const { year, month, day, hour, minu, seco } =
		getTimeUtils(midSelectedDateTime);

	if (props.modelValue) {
		inputDate.value = year + "-" + month + "-" + day;
		panelTimeFormat(hour, minu, seco);
	}
	currYear.value = year;
	currMonth.value = Number(month);
};

const { year, month } = getTimeUtils();
const tds = ref<IDate[]>([]);
const currYear = ref(year);
const currMonth = ref(Number(month));
const selectedDateTime = ref("");

const inputDate = ref("");
const inputTime = ref();

const i18nCurrDate = computed(() => {
	const { i18n } = props;
	if (i18n === "zh") {
		return {
			year: currYear.value + " 年 ",
			month: timeFormat(currMonth.value) + "月",
		};
	} else {
		return {
			year: currYear.value + " ",
			month: i18nMonths[timeFormat(currMonth.value)][i18n],
		};
	}
});

onClickOutside(DateTimeRef, () => {
	isShowPanel.value = false;
	const midSelectedDateTime =
		props.format === "yyyy-MM-DD HH"
			? selectedDateTime.value + ":00"
			: selectedDateTime.value;

	const { year, month, day } = getTimeUtils(midSelectedDateTime);
	if (props.modelValue) {
		inputDate.value = year + "-" + month + "-" + day;
	}
	getTableData(year, Number(month));
});

/**
 * 获取之前的日期
 * @param category
 */
const clickBefore = (category: string) => {
	if (panelType.value === "day" || panelType.value === "month") {
		if (category === "year") {
			currYear.value--;
		} else {
			if (currMonth.value === 1) {
				currYear.value--;
				currMonth.value = 12;
			} else {
				currMonth.value--;
			}
		}
	} else {
		nearlyADecade.value = dateTimeYear(nearlyADecade.value.flat()[0] - 10);
	}

	getTableData(currYear.value, currMonth.value);
};
/**
 * 后去之后的日期
 * @param category
 */
const clickAfter = (category: string) => {
	if (panelType.value === "day" || panelType.value === "month") {
		if (category === "year") {
			currYear.value++;
		} else {
			if (currMonth.value === 12) {
				currYear.value++;
				currMonth.value = 1;
			} else {
				currMonth.value++;
			}
		}
	} else {
		nearlyADecade.value = dateTimeYear(nearlyADecade.value.flat()[0] + 10);
	}
	getTableData(currYear.value, currMonth.value);
};
const selectYear = () => {
	panelType.value = "year";
};
const selectMonth = () => {
	panelType.value = "month";
};

const emitSelectedDate = (val: IDate) => {
	const { year, month, day, hour, minu, seco } = getTimeUtils(val.timestamp);
	inputDate.value = year + "-" + month + "-" + day;
	panelTimeFormat(hour, minu, seco);
};
const emitSelectedYearOrMonth = (val: number) => {
	if (val > 0 && val <= 12) {
		getTableData(currYear.value, val);
		currMonth.value = val;
		panelType.value = "day";
	} else {
		getTableData(val, currMonth.value);
		currYear.value = val;
		panelType.value = "month";
	}
};
const panelTypeIsYearTitle = computed(() => {
	const { i18n } = props;
	if (i18n === "zh") {
		return (
			nearlyADecade.value.flat()[0] +
			"年 - " +
			nearlyADecade.value.flat()[1] +
			"年"
		);
	} else {
		return (
			nearlyADecade.value.flat()[0] + " - " + nearlyADecade.value.flat()[1]
		);
	}
});
const clickPanelTypeIsMonth = () => {
	panelType.value = "year";
};
const selectedPickerOptions = (val: PickerOptions) => {
	const { year, month, day, hour, minu, seco } = getTimeUtils(
		val.value() as number
	);
	inputDate.value = year + "-" + month + "-" + day;
	panelTimeFormat(hour, minu, seco);
	if (year !== currYear.value || Number(month) !== currMonth.value) {
		getTableData(year, Number(month));
		currYear.value = year;
		currMonth.value = Number(month);
	}
};
const getCurrDateTime = () => {
	panelType.value = "day";
	const { year, month, day, hour, minu, seco } = getTimeUtils();
	inputDate.value = year + "-" + month + "-" + day;
	panelTimeFormat(hour, minu, seco);
	if (year !== currYear.value || Number(month) !== currMonth.value) {
		getTableData(year, Number(month));
		currYear.value = year;
		currMonth.value = Number(month);
	}
};
const panelTimeFormat = (hour: string, minu: string, seco: string) => {
	if (props.timeType === "Select") {
		inputTime.value = hour + ":" + minu;
	} else {
		if (attrs.pickerFormat === "HH:mm") {
			inputTime.value = hour + ":" + minu;
		} else if (attrs.pickerFormat === "HH") {
			inputTime.value = hour;
		} else {
			inputTime.value = hour + ":" + minu + ":" + seco;
		}
	}
};
const inputDateTimeFormat = (formatType: string) => {
	const midInputTime =
		attrs.pickerFormat === "HH" ? inputTime.value + ":00" : inputTime.value;
	const { hour, minu, seco } = getTimeUtils(
		inputDate.value + " " + midInputTime
	);

	if (formatType === "yyyy-MM-DD HH:mm") {
		selectedDateTime.value = inputDate.value + " " + hour + ":" + minu;
		emit("onClick", dateToTimeStamp(selectedDateTime.value));
	} else if (formatType === "yyyy-MM-DD HH") {
		selectedDateTime.value = inputDate.value + " " + hour;
		emit("onClick", dateToTimeStamp(selectedDateTime.value + ":00"));
	} else {
		selectedDateTime.value =
			inputDate.value + " " + hour + ":" + minu + ":" + seco;
		emit("onClick", dateToTimeStamp(selectedDateTime.value));
	}
};
const submitBtn = () => {
	if (props.format) inputDateTimeFormat(props.format);

	panelType.value = "day";
	isShowPanel.value = false;
};

if (props.modelValue) {
	const { year, month, day, hour, minu, seco } = getTimeUtils(props.modelValue);

	inputDate.value = year + "-" + month + "-" + day;
	panelTimeFormat(hour, minu, seco);

	if (props.format) inputDateTimeFormat(props.format);

	currYear.value = year;
	currMonth.value = Number(month);
}

getTableData(currYear.value, currMonth.value);
</script>
<style lang="scss" scoped>
$border-light: 1px solid var(--border-light-color);
$border-dark: 1px solid var(--border-dark-color);
.dc-date-time {
	&-input {
		display: inline-flex;
		width: 220px;
	}
	&-dialog {
		border: 1px solid var(--dialog-border-color);
		border-radius: 5px;
		&-dark {
			background-color: var(--base-dark-bg-color);
			color: var(--base-light-bg-color);
		}
		&-light {
			background-color: var(--base-light-bg-color);
			color: var(--base-dark-bg-color);
		}
		&-input {
			padding: 10px 6px;
		}
		&-header {
			display: flex;
			justify-content: space-between;
			padding: 10px 15px;
			cursor: pointer;
			user-select: none;
		}
		&-table {
			display: flex;
			justify-content: center;
		}
		&-footer {
			display: flex;
			justify-content: end;
			padding: 10px 15px;
		}
	}
}

.border-top-light {
	border-top: $border-light;
}
.border-top-dark {
	border-top: $border-dark;
}
.dc-dialog-layout {
	display: flex;
}
</style>
