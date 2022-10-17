<template>
	<DefaultInput @focus="openDialog" />
	<Teleport to="body">
		<div ref="DateTimeRef">DateTime</div>
	</Teleport>
</template>

<script lang="ts">
export default {
	name: "DateTime",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import DefaultInput from "../../Input/src/input.vue";
import { PickerOptions } from "../constants";

const DateTimeRef = ref();

const openDialog = () => {
	console.log("------>");
};
</script>
<style lang="scss" scoped></style>
