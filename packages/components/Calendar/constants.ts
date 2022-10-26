import { IDate } from "../../utils/dateTimePicker";

export type Panel = {
	tds: IDate[][];
	title: string;
	distinguish: string;
};
export type CalendarPanelList = {
	leftPanel: Panel;
	rightPanel: Panel;
};

export type PickerOptions = {
	text: string;
	value: () => number[] | number;
};

export type SelectedDateList = {
	val: number;
	category: string;
};
export const DATETIMEMONTH = [
	["一月", "二月", "三月", "四月"],
	["五月", "六月", "七月", "八月"],
	["九月", "十月", "十一月", "十二月"],
];

export const CASECONVERSION = [
	{
		name: "一月",
		val: 1,
	},
	{
		name: "二月",
		val: 2,
	},
	{
		name: "三月",
		val: 3,
	},
	{
		name: "四月",
		val: 4,
	},
	{
		name: "五月",
		val: 5,
	},
	{
		name: "六月",
		val: 6,
	},
	{
		name: "七月",
		val: 7,
	},
	{
		name: "八月",
		val: 8,
	},
	{
		name: "九月",
		val: 9,
	},
	{
		name: "十月",
		val: 10,
	},
	{
		name: "十一月",
		val: 11,
	},
	{
		name: "十二月",
		val: 12,
	},
];
