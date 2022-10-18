<template>
  <button class="dc-button">
    <slot></slot>
  </button>
</template>

<script lang="ts">
export default {
  name: "DefaultButton",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
type Props = {
  size: string;
};

const props = withDefaults(defineProps<Props>(), {
  size: "normal",
});
const dynamicPadding = ref("12px 20px");
const dynamicFontSize = ref("14px");
const dynamicBorderRadius = ref("4px");
if (props.size == "small") {
  dynamicPadding.value = "9px 15px";
  dynamicFontSize.value = "12px";
  dynamicBorderRadius.value = "3px";
}
</script>

<style lang="scss" scoped>
.dc-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: v-bind(dynamicPadding);
  font-size: v-bind(dynamicFontSize);
  border-radius: v-bind(dynamicBorderRadius);
}
.dc-button:hover {
  color: #409eff;
  border-color: #409eff;
}
</style>
