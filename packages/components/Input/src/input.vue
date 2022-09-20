<template>
  <div class="dc-input">
    <input
      type="text"
      class="dc-input__inner"
      autocomplete="off"
      v-model="modelValue"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "defaultInput",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, computed, Ref, onMounted } from "vue";

type Props = {
  modelValue: string;
  size?: string;
};
const { size } = withDefaults(defineProps<Props>(), {
  size: "normal",
});

const inputHeight = computed(() => {
  if (size === "small") {
    return "32px";
  }
  return "40px";
});
</script>

<style lang="scss" scoped>
.dc-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  &__inner {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
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