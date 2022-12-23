<template>
	<component :is="componentType" v-bind="$attrs" />
</template>

<script lang="ts">
export default {
	name: "DefaultCalendar",
};
</script>
<script lang="ts" setup>
import { type Component, shallowRef } from "vue";
import DefaultDateTimePicker from "./DateTimePicker/index.vue";
import DefaultDateTime from "./DateTime/index.vue";
import DefaultDate from "./Date/index.vue";
import DefaultDatePicker from "./DatePicker/index.vue";

type Props = {
	type?: string;
};

const props = defineProps<Props>();

const componentType = shallowRef<Component>();
switch (props.type) {
	case "DateTimePicker":
		componentType.value = DefaultDateTimePicker;
		break;
	case "DateTime":
		componentType.value = DefaultDateTime;
		break;
	case "Date":
		componentType.value = DefaultDate;
		break;
	case "DatePicker":
		componentType.value = DefaultDatePicker;
		break;
	default:
		componentType.value = DefaultDateTimePicker;
		break;
}
</script>
<style lang="scss" scoped></style>
