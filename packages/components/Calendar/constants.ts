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
  text: () => string;
  value: () => number[] | number;
};

export type DisabledDate = {
  type: string;
  range: string | string[];
};
export type Attrs = {
  disabledDate: DisabledDate;
};

export type SelectedDateList = {
  val: number;
  category: string;
};
