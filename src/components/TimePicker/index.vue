<template>
  <div>
    <div @click="inputFocus">
      <input type="text" v-model="inputRef" autocomplete="off" />
    </div>

    <div v-if="timePickerStatus" ref="timePickerRef" class="outer">
      <div class="time-picker">
        <ul v-for="item in showUlNum" :key="item.count" :id="item.id">
          <li
            v-for="list in item.count"
            :key="list"
            :ref="item.liRef"
            @click="selectTime(item.liRef, timeFormat(list - 1), item.id)"
          >
            {{ timeFormat(list - 1) }}
          </li>
        </ul>
      </div>
      <div class="footer">
        <button @click="cancelBtn">取消</button>
        <button @click="submitBtn">确定</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import { onClickOutSide } from "../../utils/onClickOutside";
import { selectedTime, ulList } from "../../utils/timePicker";

const timePickerStatus = ref(false);
const timePickerRef = ref();

const inputRef = ref("18:20:00");
const currHour = ref("18");
const currMinu = ref("20");
const currSeco = ref("00");

type Props = {
  showCategory?: string[];
  isMountBody?: boolean;
  modelValue: string;
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
    return currHour.value + " : " + currMinu.value;
  } else if (!props.showCategory.includes("hour")) {
    return currMinu.value + " : " + currSeco.value;
  }

  return currHour.value + " : " + currMinu.value + " : " + currSeco.value;
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
onClickOutSide(timePickerRef, () => {
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
$common-border: 1px solid #ebeef5;
input {
  outline: none;
  border: $common-border;
}
.outer {
  position: absolute;
  background-color: #fff;
  border: 1px solid #e4e7ed;
}
.time-picker {
  display: flex;
  height: 170px;
  width: 160px;
  overflow: hidden;
  border-bottom: 1px solid #e4e7ed;
}
.footer {
  display: flex;
  justify-content: right;
  margin: 10px 0;
  button {
    border: $common-border;
    background-color: #fff;
    color: #409eff;
    padding: 5px 15px;
    margin: 0 5px;
    cursor: pointer;
  }
}
.time-picker::before,
.time-picker::after {
  content: "";
  top: 50%;
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
ul {
  overflow: hidden;
  scroll-snap-type: y mandatory;
  flex: 1;
  padding: 0;
  margin: 0;
  z-index: 101;
  text-align: center;
}
ul::-webkit-scrollbar {
  width: 5px;
  background-color: none;
}
ul::-webkit-scrollbar-thumb {
  background-color: #eeeeee;
  border-radius: 10px;
}
ul::before,
ul::after {
  content: "";
  display: block;
  width: 100%;
  height: 65px;
}
ul:hover {
  overflow-y: auto;
}
li {
  list-style: none;
  text-align: center;
  width: 40px;
  height: 32px;
  line-height: 32px;
  scroll-snap-align: center;
  cursor: pointer;
  user-select: none;
}
</style>
