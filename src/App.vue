<template>
	<DefaultCalendar type="DateTimePicker" :i18n="i18n" />
	<DefaultButton @click="changeLang">change</DefaultButton>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
const defaultValue = ref(new Date(2000, 10, 10));
const i18n = ref("en");

const changeLang = () => {
	i18n.value = i18n.value === "zh" ? "en" : "zh";
};

const getSelectedDate = (val: number) => {
	console.log(val);
};
</script>

<style lang="scss" scoped></style>
