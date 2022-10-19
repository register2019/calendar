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
import { primaryColor } from "../../utils";
type Props = {
  size?: string;
  type?: string;
};

const props = withDefaults(defineProps<Props>(), {
  size: "normal",
  type: "primary",
});
const dynamicPadding = ref("12px 20px");
const dynamicFontSize = ref("14px");
const dynamicBorderRadius = ref("4px");
const dynamicBorder = ref("1px solid #dcdfe6");
const dynamicColor = ref("#606266");
const dynamicBackground = ref("#fff");

const dynamicHoverColor = ref(primaryColor);
const dynamicHoverBorderColor = ref(primaryColor);
if (props.size === "small") {
  dynamicPadding.value = "9px 15px";
  dynamicFontSize.value = "12px";
  dynamicBorderRadius.value = "3px";
}

if (props.type === "text") {
  dynamicBorder.value = "1px solid transparent";
  dynamicPadding.value = "12px 0 12px";
  dynamicColor.value = primaryColor;
  dynamicBackground.value = "transparent";
  dynamicHoverColor.value = "#66b1ff";
  dynamicHoverBorderColor.value = "transparent";
}
</script>

<style lang="scss" scoped>
.dc-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: v-bind(dynamicBackground);
  border: v-bind(dynamicBorder);
  color: v-bind(dynamicColor);
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
  color: v-bind(dynamicHoverColor);
  border-color: v-bind(dynamicHoverBorderColor);
}
</style>
