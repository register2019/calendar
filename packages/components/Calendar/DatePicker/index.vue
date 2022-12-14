<template>
	<div
		:class="['dc-date-picker-input', props.theme === 'dark' ? 'dark' : 'light']"
		ref="inputRef"
		@click="openPanel"
	>
		<DefaultInput
			v-model="startDateInput"
			:size="props.inputSize"
			class="borderUI"
		/>
		<span>{{ computedRangeSeparator }}</span>
		<DefaultInput
			v-model="endDateInput"
			:size="props.inputSize"
			class="borderUI"
		/>
	</div>
	<Teleport to="body">
		<div v-show="isShowPanel">
			<div
				:style="calendarStyle"
				:class="[
					'dc-date-picker-panel',
					props.theme === 'dark' ? 'dark' : 'light',
				]"
				ref="panelRef"
			>
				<PanelSider
					v-if="props.pickerOptions && props.pickerOptions.length !== 0"
					:pickerOptions="props.pickerOptions"
					v-bind="$attrs"
					@selected-picker-options="selectedPickerOptions"
				/>
				<PickerComponents
					:modelValue="props.modelValue"
					:pickerOptions="props.pickerOptions"
					:selectedDateList="selectedDateList"
					v-bind="$attrs"
					@date-range="getDateRange"
				/>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts">
export default {
	name: "DefaultDatePicker",
};
</script>
<script lang="ts" setup>
import {
	onClickOutside,
	useElementBounding,
	useWindowSize,
} from "@vueuse/core";
import {
	ref,
	CSSProperties,
	nextTick,
	watch,
	useAttrs,
	onUpdated,
	onMounted,
} from "vue";
import { dateFormat, global, i18nFooterBtn } from "../../../utils";
import DefaultInput from "../../Input/src/input.vue";
import PickerComponents from "../Components/picker-components.vue";
import PanelSider from "../Components/panelSider.vue";
import { PickerOptions, SelectedDateList } from "../constants";

type Props = {
	modelValue?: Date[];
	rangeSeparator?: string;
	pickerOptions?: PickerOptions[];
	theme?: string;
	inputSize?: string;
};

const props = withDefaults(defineProps<Props>(), {
	rangeSeparator: "至",
	theme: "light",
	inputSize: "normal",
});

watch(
	() => props.theme,
	(val) => {
		global.theme = val;
	},
	{
		immediate: true,
	}
);

const computedRangeSeparator = ref("");
const initSeparator = () => {
	const { i18n } = useAttrs();
	if (i18n) {
		if (props.rangeSeparator === "至") {
			computedRangeSeparator.value = i18nFooterBtn.to[i18n as string];
		} else {
			computedRangeSeparator.value = props.rangeSeparator;
		}
	} else {
		computedRangeSeparator.value = props.rangeSeparator;
	}
};
const isMounted = ref(false);
onUpdated(() => {
	if (!isMounted.value) {
		initSeparator();
	} else {
		isMounted.value = false;
	}
});
onMounted(() => {
	isMounted.value = true;
	initSeparator();
});

const emit = defineEmits(["onClick"]);

const panelRef = ref();
const inputRef = ref();
const isShowPanel = ref(false);

const startDateInput = ref("");
const endDateInput = ref("");
const calendarStyle = ref<CSSProperties>({
	position: "absolute",
	top: "",
	left: "",
	width: "646px",
});

const getDateRange = (val: number[]) => {
	startDateInput.value = dateFormat(val[0]);
	endDateInput.value = dateFormat(val[1]);
	emit("onClick", val);
	isShowPanel.value = false;
};

const selectedDateList = ref<SelectedDateList[]>([]);
const selectedPickerOptions = (val: PickerOptions) => {
	const target = val.value() as number[];
	for (let i = 0; i < target.length; i++) {
		selectedDateList.value.push({
			val: target[i],
			category: "click",
		});
	}
	getDateRange(target);
};

if (props.pickerOptions) {
	calendarStyle.value.width = "782px";
}

onClickOutside(panelRef, () => {
	isShowPanel.value = false;
});

const openPanel = () => {
	const { top, left, height, bottom } = useElementBounding(inputRef);

	calendarStyle.value.top = top.value + height.value + 5 + "px";
	calendarStyle.value.left = left.value + "px";

	isShowPanel.value = true;
	nextTick(() => {
		const { height: panelHeight } = useElementBounding(panelRef);
		const { height } = useWindowSize();
		if (bottom.value + panelHeight.value >= height.value) {
			calendarStyle.value.top = top.value - panelHeight.value - 5 + "px";
		}
	});
};
</script>

<style lang="scss" scoped>
$borderUI: 1px solid var(--border-color);
.dc-date-picker-input {
	display: inline-flex;
	align-items: center;
	width: 350px;
	border: $borderUI;
	border-radius: 5px;
	span {
		margin: 0 6px;
	}
	:deep(.borderUI) > input {
		border: none;
	}
}
.dc-date-picker-panel {
	display: flex;
	border: $borderUI;
	border-radius: 5px;
}
.dark {
	background-color: var(--base-dark-bg-color);
	color: var(--base-light-bg-color);
}
.light {
	background-color: var(--base-light-bg-color);
	color: var(--base-dark-bg-color);
}
</style>
