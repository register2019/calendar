<template>
  <div>
    <!-- <input type="text" class="dc-input" autocomplete="off" /> -->
    <DefaultInput @click="inputFocus" v-model="inputRef" />

    <div v-if="timePickerStatus" ref="timePickerRef" class="dc-outer">
      <div class="dc-time-picker">
        <ul
          class="dc-ul"
          v-for="item in showUlNum"
          :key="item.count"
          :id="item.id"
        >
          <li
            class="dc-li"
            v-for="list in item.count"
            :key="list"
            :ref="item.liRef"
            @click="selectTime(item.liRef, timeFormat(list - 1), item.id)"
          >
            {{ timeFormat(list - 1) }}
          </li>
        </ul>
      </div>
      <div class="dc-footer">
        <a class="dc-footer-cancel" @click="cancelBtn">取消</a>
        <a class="dc-footer-submit" @click="submitBtn">确定</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DefaultTimePicker",
};
</script>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, watch, computed, onMounted, defineComponent } from "vue";

import { selectedTime, ulList } from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";

const timePickerStatus = ref(false);
const timePickerRef = ref();

const inputRef = ref("18:20:00");
const currHour = ref("18");
const currMinu = ref("20");
const currSeco = ref("00");

type Props = {
  showCategory?: string[];
  isMountBody?: boolean;
  modelValue?: string;
};

const props = withDefaults(defineProps<Props>(), {
  showCategory: () => ["hour", "minu", "seco"],
  isMountBody: true,
  modelValue: "",
});

const emit = defineEmits(["update:modelValue"]);

let showUlNum = computed(() => {
  return ulList.filter((item) => props.showCategory.includes(item.id));
});
let inputValue = computed(() => {
  if (!props.showCategory.includes("seco")) {
    return currHour.value + ":" + currMinu.value;
  } else if (!props.showCategory.includes("hour")) {
    return currMinu.value + ":" + currSeco.value;
  }

  return currHour.value + ":" + currMinu.value + ":" + currSeco.value;
});

const timeFormat = (num: number) => {
  return num < 10 ? "0" + num : num.toString();
};

const inputFocus = () => {
  timePickerStatus.value = true;
  const temList = [currHour, currMinu, currSeco];

  setTimeout(() => {
    showUlNum.value.forEach((item, index) => {
      const ulDom = document.querySelector(`#${item.id}`)!;

      selectedTime(item.liRef, ulDom, temList[index], item.id);
    });
  }, 200);
};
onClickOutside(timePickerRef, () => {
  timePickerStatus.value = false;
});
watch(inputValue, (val) => {
  inputRef.value = val;
});
/**
 * 点击时分秒 滚动到指定位置
 * @param el
 * @param val
 * @param id
 */
const selectTime = (el: any, val: string, id: string) => {
  let top = el.value[Number(val)].offsetTop - 65;

  const ulDom = document.querySelector(`#${id}`)!;
  ulDom.scrollTo({
    top,
  });
};

const cancelBtn = () => {
  emit("update:modelValue", inputRef.value);
  timePickerStatus.value = false;
};
const submitBtn = () => {
  emit("update:modelValue", inputRef.value);
  timePickerStatus.value = false;
};

onMounted(() => {
  emit("update:modelValue", inputRef.value);
});
</script>

<style lang="scss" scoped>
$common-border: 1px solid #dcdfe6;
$common-input-padding: 0 15px;
.dc-input {
  outline: none;
  border: $common-border;
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding: $common-input-padding;
}
.dc-outer {
  position: absolute;
  background-color: #fff;
  border: 1px solid #e4e7ed;
}
.dc-time-picker {
  display: flex;
  height: 170px;
  width: 160px;
  overflow: hidden;
  border-bottom: 1px solid #e4e7ed;
}
.dc-footer {
  display: flex;
  justify-content: right;
  margin: 10px 0;
  &-cancel,
  &-submit {
    background-color: #fff;
    font-size: 12px;
    margin: 0 5px;
    cursor: pointer;
    letter-spacing: 5px;
  }
  &-submit {
    color: #409eff;
  }
}
.dc-time-picker::before,
.dc-time-picker::after {
  content: "";
  top: 40%;
  position: absolute;
  margin: -16px 12% 0 12%;
  height: 32px;
  z-index: 100;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding-top: 6px;
  text-align: left;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
}
.dc-ul {
  overflow: hidden;
  scroll-snap-type: y mandatory;
  flex: 1;
  padding: 0;
  margin: 0;
  z-index: 101;
  text-align: center;
}
.dc-ul::-webkit-scrollbar {
  width: 5px;
  background-color: none;
}
.dc-ul::-webkit-scrollbar-thumb {
  background-color: #eeeeee;
  border-radius: 10px;
}
.dc-ul::before,
.dc-ul::after {
  content: "";
  display: block;
  width: 100%;
  height: 68px;
}
.dc-ul:hover {
  overflow-y: auto;
}
.dc-li {
  list-style: none;
  text-align: center;
  width: 40px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  scroll-snap-align: center;
  cursor: pointer;
  user-select: none;
}
</style>
