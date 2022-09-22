<template>
	<DefaultCalendar
		v-model="selectedTimeRange"
		@onClick="getSelectedTimeRange"
	/>
	<!-- <DefaultTimeSelect /> -->
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
const selectedTimeRange = ref<[Date, Date]>([
	new Date(2000, 10, 10, 10, 10),
	new Date(2000, 10, 11, 10, 10),
]);

const getSelectedTimeRange = (val: number[]) => {
	console.log(val);
};
</script>

<style lang="scss" scoped></style>
