## 使用方法

### 全局引入

#### 在main.ts中
```typescript
import { DefaultComponents } from 'default-calendar'
app.use(DefaultComponents())
```

#### type为DateTimePicker
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

const getSelectedTimeRange = (val: number[]) => {

}

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
#### type为DateTime
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
#### type为Date
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


| 参数             | 描述                                                                          | 类型                                       |
| --------------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| unlinkPanels    | 可选 是否取消左右 日期面板的联动                                                  | boolean: false                            |
| timeType        | 日期面板时间类型 可选Picker和Select                                              | string: Picker                            |
| pickerOptions   | 设置快捷选项                                                                    | Array                                     |
| selectOptions   | 当timeType为Select时 用于设置TimeSelect的开始、结束及间隔时间                      | Object                                    |
| type            | 日历面板的类型 目前支持DateTimePicker、DateTime、Date                             | String                                     |