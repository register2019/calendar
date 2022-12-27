<template>
  <div>
    <DefaultInput
      :size="size"
      v-model="currSelectedTime"
      @click="openTimeSelectPanel"
      ref="timeSelectInputRef"
      v-bind="$attrs"
    />
    <div
      v-show="isShowTimeSelectPanel"
      ref="timeSelectRef"
      :class="['dc-time-select', global.theme === 'dark' ? 'dark' : 'light']"
    >
      <div
        v-for="(item, index) in initTimeSelectPanel(props.selectOptions)"
        :key="index"
        :class="[
          'dc-time-select-item',
          `dc-time-select-${global.theme}-item`,
          initSelectedTimeStyle(item),
        ]"
        @click="selectTime(item)"
        ref="selectTimeItemRef"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DefaultTimeSelect",
};
</script>
<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import DefaultInput from "../../Input/src/input.vue";
import { onClickOutside, useElementBounding } from "@vueuse/core";
import { initTimeSelectPanel, SelectOptions } from "../../../utils/timeSelect";
import { global } from "../../../utils";

type Props = {
  modelValue?: string;
  selectOptions?: SelectOptions;
  size?: string;
};

const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<Props>(), {
  selectOptions: (): SelectOptions => ({
    start: "08:30",
    step: "00:13",
    end: "18:30",
  }),
});

const currSelectedTime = ref("08:30");
const isShowTimeSelectPanel = ref(false);
const timeSelectRef = ref();
const selectTimeItemRef = ref();

watch(
  () => props,
  (val) => {
    currSelectedTime.value = val.modelValue!;
  },
  {
    deep: true,
    immediate: true,
  }
);

// 获取time-select输入框的size
const timeSelectInputRef = ref(null);
// 动态设置time-select-panel的宽度
const timeSelectPanelWidth = ref("");
const openTimeSelectPanel = () => {
  isShowTimeSelectPanel.value = true;
  const { width } = useElementBounding(timeSelectInputRef);
  timeSelectPanelWidth.value = width.value + "px";
  nextTick(() => {
    selectTimeItemRef.value.forEach((item: HTMLDivElement) => {
      if (item.innerText === currSelectedTime.value) {
        timeSelectRef.value.scrollTo({
          top: item.offsetTop,
        });
      }
    });
  });
};

onClickOutside(timeSelectRef, () => {
  isShowTimeSelectPanel.value = false;
});

const selectTime = (time: string) => {
  currSelectedTime.value = time;
  emit("update:modelValue", currSelectedTime.value);
  isShowTimeSelectPanel.value = false;
};
const initSelectedTimeStyle = (val: string) => {
  if (currSelectedTime.value === val) {
    return "dc-currSelectedTimeStyle";
  }
  return "";
};
</script>

<style lang="scss" scoped>
.dc {
  &-time-select {
    position: absolute;
    height: 200px;
    min-width: 140px;
    width: v-bind(timeSelectPanelWidth);
    overflow: overlay; // 设置滚动条位于hover效果的上方
    border-radius: 5px;
    &-item {
      position: relative;
      padding: 8px 10px;
      font-size: 14px;
      line-height: 20px;
      cursor: pointer;
    }
    &-light-item:hover {
      background-color: var(--disabled-bg-light-color);
      font-weight: 700;
    }
    &-dark-item:hover {
      background-color: var(--picker-dark-color);
      font-weight: 700;
    }
  }
  &-time-select::-webkit-scrollbar {
    width: 6px;
    display: block;
  }
  &-time-select:hover::-webkit-scrollbar {
    display: block;
  }
  &-time-select::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-color);
    width: 5px;
    border-radius: 5px;
    border-right: 1px solid var(--white-color);
  }
  &-currSelectedTimeStyle {
    color: var(--primary-color);
    font-weight: 700;
  }
}
.dark {
  background-color: var(--base-dark-bg-color);
  color: var(--base-light-bg-color);
  border: 1px solid var(--border-dark-color);
}
.light {
  background-color: var(--base-light-bg-color);
  color: var(--base-dark-bg-color);
  border: 1px solid var(--border-light-color);
}
</style>
