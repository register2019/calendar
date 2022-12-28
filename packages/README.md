## 使用方法

### 全局引入

#### 在 main.ts 中

```typescript
import { DefaultComponents } from "default-calendar";
app.use(DefaultComponents());
```

#### type 为 DateTimePicker、DatePicker

```html
<DefaultCalendar
	v-model="selectedTimeRange"
	type="DateTimePicker"
	@onClick="getSelectedTimeRange"
	:pickerOptions="pickerOptions"
	:selectOptions="selectOptions"
/>
<DefaultCalendar
	v-model="selectedTimeRange"
	type="DatePicker"
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
			return [start, end];
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

#### type 为 DateTime、Date

```html
<DefaultCalendar
	v-model="defaultValue"
	timeType="Select"
	type="DateTime"
	:picker-options="pickerOptions"
	:selectOptions="selectOptions"
	@onClick="getSelectedTime"
/>
<DefaultCalendar
	v-model="defaultValue"
	type="Date"
	:pickerOptions="pickerOptions"
	@onClick="getSelectedDate"
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

#### i18n 国际化

```html
<DefaultCalendar
	v-model="defaultValue"
	type="DateTime"
	timeType="Select"
	:i18n="i18nGlobal"
	:picker-options="pickerOptions"
/>
```

```js
const i18nGlobal = ref("zh");
// 使用vue-i18n需要国际化的内容需要写成函数形式
const pickerOptions = [
	{
		text: "today",
		value: () => new Date().getTime(),
	},
	{
		text: () => t("yestorday"),
		value: () => new Date().getTime() - 3600 * 1000 * 24,
	},
	{
		text: () => t("beforeWeek"),
		value: () => new Date().getTime() - 3600 * 1000 * 24 * 7,
	},
];
```

| 参数           | 描述                                                                    | 类型    | 默认值                         |
| -------------- | ----------------------------------------------------------------------- | ------- | ------------------------------ |
| unlinkPanels   | 可选 是否取消左右 日期面板的联动                                        | boolean | false                          |
| timeType       | 日期面板时间类型 可选 Picker 和 Select                                  | string  | Picker                         |
| pickerOptions  | 设置快捷选项                                                            | Array   | ~                              |
| selectOptions  | 当 timeType 为 Select 时 用于设置 TimeSelect 的开始、结束及间隔时间     | Object  | ~                              |
| type           | 日历面板的类型 目前支持 DateTimePicker、DateTime、Date、DatePicker      | String  | DateTimePicker                 |
| disabledDate   | 禁用日期 支持 before、after、today、range 四种类型                      | Object  | ~                              |
| rangeSeparator | 类型为 DatePicker 或 DateTimePicker 时 分隔符可自定义                   | String  | 至                             |
| format         | 用于格式化选中日期的类型 支持 yyyy-MM-DD（HH:mm:ss、HH:mm、HH）         | String  | yyyy-MM-DD HH:mm:ss            |
| pickerFormat   | 用于格式化 TimeType 为 Picker 时的时间显示格式 支持 HH:mm:ss、HH:mm、HH | String  | HH:mm:ss                       |
| i18n           | 用于国际化文本内容                                                      | string  | 中文-'zh' 英文-'en' 默认为中文 |
| theme          | 设置主题 目前支持 light 和 dark 模式                                    | string  | light                          |
