<template>
	<component :is="componentType" v-bind="$attrs" />
</template>

<script lang="ts">
export default {
	name: "DefaultCalendar",
};
</script>
<script lang="ts" setup>
import { shallowRef } from "vue";
import DefaultDateTimePicker from "./DateTimePicker/index.vue";
import DefaultDateTime from "./DateTime/index.vue";

type Props = {
	type: string;
};

const props = defineProps<Props>();

const componentType = shallowRef();
switch (props.type) {
	case "DateTimePicker":
		componentType.value = DefaultDateTimePicker;
		break;
	case "DateTime":
		componentType.value = DefaultDateTime;
		break;
	default:
		break;
}
</script>
<style lang="scss" scoped></style>
