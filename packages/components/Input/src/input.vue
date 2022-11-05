<template>
  <div class="dc-input">
    <input
      type="text"
      class="dc-input__inner"
      autocomplete="off"
      v-model="inputValue"
      :disabled="props.disabled"
      @blur="onBlur"
      @focus="onFocus"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "DefaultInput",
};
</script>
<script lang="ts" setup>
import { ref, watch, computed } from "vue";

type Props = {
  modelValue?: string;
  size?: string;
  disabled?: boolean;
};
const emit = defineEmits(["update:modelValue", "blur", "focus"]);
const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  size: "normal",
  disabled: false,
});
const inputValue = ref(props.modelValue);

const inputHeight = computed(() => {
  if (props.size === "small") {
    return "32px";
  }
  return "40px";
});
const onBlur = () => {
  emit("blur", () => {});
};
const onFocus = () => {
  emit("focus", () => {});
};

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});
const inputBg = ref("#fff");
watch(
  () => props.disabled,
  (val) => {
    if (val) {
      inputBg.value = "#f5f7fa";
    } else {
      inputBg.value = "#fff";
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
  }
);
</script>

<style lang="scss" scoped>
.dc-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  &__inner {
    text-align: center;
    background-color: v-bind(inputBg);
    background-image: none;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
    display: inline-block;
    font-size: inherit;
    height: v-bind(inputHeight);
    line-height: v-bind(inputHeight);
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
}
</style>
