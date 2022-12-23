<template>
	<div class="dc-picker">
		<div class="dc-picker-left">
			<div class="header">
				<span>
					<span @click="clickBefore('year')">&lt;&lt;</span>
					<span @click="clickBefore('month')" style="margin-left: 10px"
						>&lt;</span
					>
				</span>
				<span class="title">{{ startDate }}</span>
				<span></span>
			</div>
			<PanelTable
				v-bind="$attrs"
				:i18n="props.i18n"
				:tds="leftTds"
				:selected-date-list="selectedDateList"
				@emit-selected-date="emitSelectedDate"
			/>
		</div>
		<div class="dc-picker-right">
			<div class="header">
				<span></span>
				<span class="title">{{ endDate }}</span>
				<span>
					<span @click="clickAfter('month')" style="margin-right: 10px"
						>&gt;</span
					>
					<span @click="clickAfter('year')">&gt;&gt;</span>
				</span>
			</div>
			<PanelTable
				v-bind="$attrs"
				:i18n="props.i18n"
				:tds="rightTds"
				:selected-date-list="selectedDateList"
				@emit-selected-date="emitSelectedDate"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, useAttrs } from "vue";
import {
	dateToTimeStamp,
	getCurrPageDays,
	getTimeUtils,
	i18nMonths,
	IDate,
	timeFormat,
} from "../../../utils";
import { PickerOptions, SelectedDateList } from "../constants";
import PanelTable from "./panelTable.vue";

type Props = {
	modelValue?: Date[];
	pickerOptions?: PickerOptions[];
	selectedDateList?: SelectedDateList[];
	i18n?: string;
};

const props = withDefaults(defineProps<Props>(), {
	i18n: "zh",
});

const emit = defineEmits(["dateRange", "isCompleteSelection"]);

const startYear = ref(0);
const startMonth = ref(0);
const endYear = ref(0);
const endMonth = ref(0);
const leftTds = ref();
const rightTds = ref();

const attrs = useAttrs();

const updateTable = (
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number
) => {
	leftTds.value = getCurrPageDays(startYear, startMonth);
	rightTds.value = getCurrPageDays(endYear, endMonth);
};

const clickBefore = (type: string) => {
	if (attrs.unlinkPanels) {
		// 设置左右面板不联动
		if (type === "year") {
			startYear.value--;
		} else {
			if (startMonth.value === 1) {
				startYear.value--;
				startMonth.value = 12;
			} else {
				startMonth.value--;
			}
		}
	} else {
		if (type === "year") {
			startYear.value--;
			endYear.value--;
		} else {
			if (startMonth.value === 1) {
				startYear.value--;
				startMonth.value = 12;
				endMonth.value--;
			} else if (endMonth.value === 1) {
				endYear.value--;
				endMonth.value = 12;
				startMonth.value--;
			} else {
				startMonth.value--;
				endMonth.value--;
			}
		}
	}
	updateTable(startYear.value, startMonth.value, endYear.value, endMonth.value);
};
const clickAfter = (type: string) => {
	if (attrs.unlinkPanels) {
		if (type === "year") {
			endYear.value++;
		} else {
			if (endMonth.value === 12) {
				endYear.value++;
				endMonth.value = 1;
			} else {
				endMonth.value++;
			}
		}
	} else {
		if (type === "year") {
			startYear.value++;
			endYear.value++;
		} else {
			if (endMonth.value === 12) {
				endYear.value++;
				endMonth.value = 1;
				startMonth.value++;
			} else if (startMonth.value === 12) {
				startYear.value++;
				startMonth.value = 1;
				endMonth.value++;
			} else {
				startMonth.value++;
				endMonth.value++;
			}
		}
	}
	updateTable(startYear.value, startMonth.value, endYear.value, endMonth.value);
};

const selectedDateList = ref<SelectedDateList[]>([]);
const emitSelectedDate = (val: IDate, category: string) => {
	const { timestamp } = val;
	if (
		selectedDateList.value.length === 2 &&
		selectedDateList.value[0].category === "click" &&
		selectedDateList.value[1].category === "click"
	) {
		selectedDateList.value = [];
		selectedDateList.value.push({ val: timestamp, category });
		emit("isCompleteSelection", false);
	} else if (selectedDateList.value.length === 0 && category === "click") {
		selectedDateList.value.push({ val: timestamp, category });
		emit("isCompleteSelection", false);
	} else if (selectedDateList.value.length === 1 && category === "mouse") {
		if (timestamp >= selectedDateList.value[0].val) {
			selectedDateList.value.push({ val: timestamp, category });
		} else {
			selectedDateList.value.unshift({ val: timestamp, category });
		}
		emit("isCompleteSelection", false);
	} else if (
		(selectedDateList.value.length === 2 && category === "mouse") ||
		(selectedDateList.value.length === 2 && category === "click")
	) {
		const target = selectedDateList.value.find(
			(item) => item.category === "click"
		)!;
		selectedDateList.value = [];
		selectedDateList.value.push(target);
		if (timestamp >= target.val) {
			selectedDateList.value.push({ val: timestamp, category });
		} else {
			selectedDateList.value.unshift({ val: timestamp, category });
		}
		if (category === "click") {
			emit("dateRange", [
				selectedDateList.value[0].val,
				selectedDateList.value[1].val,
			]);
			emit("isCompleteSelection", true);
		} else {
			emit("isCompleteSelection", false);
		}
	}
};

const startDate = computed(() => {
	const { i18n } = props;
	if (i18n === "zh") {
		return startYear.value + "年" + timeFormat(startMonth.value) + "月";
	} else {
		return (
			startYear.value + " " + i18nMonths[timeFormat(startMonth.value)][i18n]
		);
	}
});
const endDate = computed(() => {
	const { i18n } = props;
	if (i18n === "zh") {
		return endYear.value + "年" + timeFormat(endMonth.value) + "月";
	} else {
		return endYear.value + " " + i18nMonths[timeFormat(endMonth.value)][i18n];
	}
});

const initTable = (year: number, month: number) => {
	let startDateYear = year;
	let startDateMonth = month;
	let endDateYear = 0;
	let endDateMonth = 0;
	if (month === 12) {
		endDateYear = startDateYear + 1;
		endDateMonth = 1;
	} else {
		endDateYear = year;
		endDateMonth = startDateMonth + 1;
	}
	startYear.value = startDateYear;
	startMonth.value = startDateMonth;
	endYear.value = endDateYear;
	endMonth.value = endDateMonth;
	updateTable(startDateYear, startDateMonth, endDateYear, endDateMonth);
};

if (props.modelValue && props.modelValue.length !== 0) {
	props.modelValue.forEach((item) => {
		selectedDateList.value.push({
			val: dateToTimeStamp(item),
			category: "click",
		});
	});
	const { year, month } = getTimeUtils(props.modelValue[0]);
	initTable(year, Number(month));
	emit("dateRange", [
		selectedDateList.value[0].val,
		selectedDateList.value[1].val,
	]);
} else {
	const { year, month } = getTimeUtils();
	initTable(year, Number(month));
}

watch(
	() => props.selectedDateList,
	(val) => {
		if (val?.length === 0) {
			selectedDateList.value = [];
			return;
		}

		selectedDateList.value = [...val!];

		const { year, month } = getTimeUtils(selectedDateList.value[0].val);
		if (
			(startYear.value === year && startMonth.value === Number(month)) ||
			(endYear.value === year && endMonth.value === Number(month))
		) {
			return;
		}

		initTable(year, Number(month));
	},
	{
		deep: true,
	}
);
</script>

<style lang="scss" scoped>
$border: 1px solid var(--border-color);
.dc-picker {
	display: flex;
	width: 100%;
	padding: 10px;
	background-color: #fff;
	&-left,
	&-right {
		width: 50%;
		padding: 10px 11px;
		.header {
			display: flex;
			justify-content: space-between;
			padding: 0 5px;
			cursor: pointer;
			user-select: none;
		}
	}
	&-left {
		border-right: $border;
	}
}
</style>
