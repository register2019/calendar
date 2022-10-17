<template>
	<div>dateTime</div>
</template>

<script lang="ts">
export default {
	name: "DateTime",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { PickerOptions } from "../constants";
type Props = {
	unlinkPanels?: boolean; // 是否取消左右日期间的联动 默认是联动的
	modelValue?: Date[];
	timeType?: string; // 默认是Picker 可选值为Picker和Select
	pickerOptions?: PickerOptions[];
	rangeSeparator?: string;
};
const props = defineProps<Props>();
// console.log("------>", props);
</script>
<style lang="scss" scoped></style>
