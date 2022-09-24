## 使用方法

### 全局引入

#### 在main.ts中
```typescript
import { DefaultComponents } from 'default-calendar'
app.use(DefaultComponents())
```

#### 用例
```html
<DefaultCalendar 
  v-model="selectedTimeRange"
  @onClick="getSelectedTimeRange"
/>
```

```typescript
const selectedTimeRange = ref<[Date, Date]>([
	new Date(2000, 10, 10, 10, 10),
	new Date(2000, 10, 11, 10, 10),
]);

const getSelectedTimeRange = (val: number[]) => {

}
```


| 参数             | 描述                                                                          | 类型                                       |
| --------------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| unlinkPanels    | 可选 是否取消左右 日期面板的联动                                                  | boolean: false                            |
| timeType        | 日期面板时间类型 可选Picker和Select                                              | string: Picker                            |