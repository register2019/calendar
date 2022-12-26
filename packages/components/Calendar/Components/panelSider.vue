<template>
	<div :class="['picker', global.theme === 'dark' ? 'dark' : 'light']">
		<div
			class="picker-item"
			v-for="item in props.pickerOptions"
			@click="clickShorts(item)"
		>
			{{ computedText(item.text) }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUpdated, ref, useAttrs, watch } from "vue";
import { global } from "../../../utils";
import { PickerOptions } from "../constants";

type Props = {
	pickerOptions?: PickerOptions[];
};
const props = defineProps<Props>();

const emit = defineEmits(["selectedPickerOptions"]);

const clickShorts = (item: PickerOptions) => {
	emit("selectedPickerOptions", item);
};

const computedText = (text: () => string | string) => {
	if (typeof text === "string") {
		return text;
	} else {
		return text();
	}
};
</script>

<style lang="scss" scoped>
.picker {
	min-width: 120px;
	padding: 15px 0 0 15px;
	&-item {
		padding: 5px 0;
		cursor: pointer;
		user-select: none;
	}
}
.light {
	border-right: 1px solid #e4e7ed;
}
.dark {
	border-right: 1px solid #414243;
}
</style>
