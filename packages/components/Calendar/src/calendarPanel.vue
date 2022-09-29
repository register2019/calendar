<template>
	<div>calendar-panel</div>
	<div class="dc-table-panel">
		<PanelTable
			v-for="(item, index) in calendarPanelList"
			:calendarParams="item"
			:key="index"
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed, toRefs } from "vue";
import {
	formatPanelDate,
	getCurrAdjacentMonth,
	getCurrPageDays,
	IDate,
	numberRex,
} from "../../../utils";
import { CalendarPanelList } from "./constants";
import PanelTable from "./panelTable.vue";

const calendarPanelList = reactive<CalendarPanelList>({
	leftPanel: {
		tds: [],
		title: "",
		distinguish: "is-left",
	},
	rightPanel: {
		tds: [],
		title: "",
		distinguish: "is-right",
	},
});

const { leftPanel, rightPanel } = { ...toRefs(calendarPanelList) };
const { leftYear, leftMonth, rightYear, rightMonth } = getCurrAdjacentMonth();
leftPanel.value.title = leftYear + "年" + formatPanelDate(leftMonth) + "月";
rightPanel.value.title = rightYear + "月" + formatPanelDate(rightMonth) + "日";

/**
 * 初始化日历面板二维数组
 */
for (let i = 0; i < 6; i++) {
	leftPanel.value.tds[i] = [];
	rightPanel.value.tds[i] = [];
}

const updateCalendarPanel = (val: string[], tds: IDate[][]) => {
	let i = 0;
	const year = Number(val[0]);
	const month = Number(val[1]);

	getCurrPageDays(year, month).forEach((td, index) => {
		if ((index + 1) % 7 === 0) {
			tds[i].push(td);
			i++;
		} else {
			tds[i].push(td);
		}
	});
};
watch(
	[() => leftPanel.value.title, () => rightPanel.value.title],
	(val) => {
		updateCalendarPanel(val[0].match(numberRex)!, leftPanel.value.tds);
		updateCalendarPanel(val[1].match(numberRex)!, rightPanel.value.tds);
	},
	{
		immediate: true,
	}
);
</script>
<style lang="scss" scoped>
.dc-table {
	&-panel {
		width: 646px;
		display: flex;
		color: #606266;
		font-size: 12px;
		background-color: #ffffff;
		border-radius: 2px;
		line-height: 30px;
		position: absolute;
		padding: 5px 11px;
		border: 1px solid #e4e7ed;
		box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
	}
}
</style>
