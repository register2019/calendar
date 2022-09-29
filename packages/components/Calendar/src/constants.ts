import { IDate } from "./../../../utils/dateTimePicker";

export type Panel = {
	tds: IDate[][];
	title: string;
	distinguish: string;
};
export type CalendarPanelList = {
	leftPanel: Panel;
	rightPanel: Panel;
};
