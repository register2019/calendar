## 使用方法

### 全局引入

#### 在 main.ts 中

```typescript
import { DefaultComponents } from "default-calendar";
app.use(DefaultComponents());
```

#### type 为 DateTimePicker

```html
<DefaultCalendar
	v-model="selectedTimeRange"
	type="DateTimePicker"
	@onClick="getSelectedTimeRange"
	:pickerOptions="pickerOptions"
	:selectOptions="selectOptions"
/>
```

```typescript
const selectedTimeRange = ref<[Date, Date]>([
	new Date(2000, 10, 10, 10, 10),
	new Date(2000, 10, 11, 10, 10),
]);

const getSelectedTimeRange = (val: number[]) => {};

const pickerOptions = [
	{
		text: "最近一周",
		value: () => {
			const end = new Date().getTime();
			const start = new Date().getTime() - 3600 * 1000 * 24 * 7;
		},
	},
];

// 当timeType为Select时
const selectOptions = {
	start: "08:30",
	step: "00:15",
	end: "18:30",
};
```

#### type 为 DateTime

```html
<DefaultCalendar
	v-model="defaultValue"
	timeType="Select"
	type="DateTime"
	:picker-options="pickerOptions"
	:selectOptions="selectOptions"
	@onClick="getSelectedTime"
/>
```

```typescript
// 默认时间应该于timeType类型相匹配
const defaultValue = ref(new Date(2000, 10, 10, 8, 30));
const pickerOptions = [
	{
		text: "今天",
		value: () => new Date().getTime(),
	},
	{
		text: "昨天",
		value: () => new Date().getTime() - 3600 * 1000 * 24,
	},
	{
		text: "一周前",
		value: () => new Date().getTime() - 3600 * 1000 * 24 * 7,
	},
];
const selectOptions = {
	start: "08:00",
	step: "00:15",
	end: "18:30",
};
const getSelectedTime = (val: number) => {
	console.log(val);
};
```

#### type 为 Date

```html
<DefaultCalendar
	v-model="defaultValue"
	type="Date"
	:pickerOptions="pickerOptions"
	@onClick="getSelectedDate"
/>
```

```typescript
/**
 * pickerOptions、v-model、onClick同type为DateTime
 */
```

#### disabledDate 使用

```typescript
// 只禁用这一天
const disabledDate = {
	type: "today",
	range: "2022-11-06 00:00:00",
};
// 禁用包括这一天之前的日期
const disabledDate = {
	type: "before",
	range: "2022-11-06 00:00:00",
};
// 禁用包括这一天之后的日期
const disabledDate = {
	type: "after",
	range: "2022-11-06 00:00:00",
};
// 禁用这个范围的日期
const disabledDate = {
	type: "range",
	range: ["2022-11-06 00:00:00", "2022-11-16 00:00:00"],
};
```

| 参数           | 描述                                                                | 类型    | 默认值                |
| -------------- | ------------------------------------------------------------------- | ------- | --------------------- |
| unlinkPanels   | 可选 是否取消左右 日期面板的联动                                    | boolean | false                 |
| timeType       | 日期面板时间类型 可选 Picker 和 Select                              | string  | Picker                |
| pickerOptions  | 设置快捷选项                                                        | Array   | ~                     |
| selectOptions  | 当 timeType 为 Select 时 用于设置 TimeSelect 的开始、结束及间隔时间 | Object  | ~                     |
| type           | 日历面板的类型 目前支持 DateTimePicker、DateTime、Date、DatePicker  | String  | DateTimePicker        |
| disabledDate   | 禁用日期 支持 before、after、today、range 四种类型                  | Object  | ~                     |
| rangeSeparator | 类型为 DatePicker 或 DateTimePicker 时 分隔符可自定义               | String  | '至'                  |
| format         | 用于格式化选中日期的类型 支持 yyyy-MM-DD（HH:mm:ss、HH:mm、HH）     | String  | 'yyyy-MM-DD HH:mm:ss' |
