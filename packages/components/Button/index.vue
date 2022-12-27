<template>
	<button :class="`dc-btn btn-${props.type}-${global.theme}`">
		<slot></slot>
	</button>
</template>

<script lang="ts">
export default {
	name: "DefaultButton",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { global } from "../../utils";
type Props = {
	size?: string;
	type?: string;
};

const props = withDefaults(defineProps<Props>(), {
	size: "normal",
	type: "default",
});
const dynamicPadding = ref("12px 20px");
const dynamicFontSize = ref("14px");

if (props.size === "small") {
	dynamicPadding.value = "9px 15px";
	dynamicFontSize.value = "12px";
}
</script>

<style lang="scss" scoped>
.dc-btn {
	display: inline-block;
	line-height: 1;
	white-space: nowrap;
	cursor: pointer;
	text-align: center;
	box-sizing: border-box;
	outline: none;
	margin: 0;
	transition: 0.1s;
	font-weight: 500;
	padding: v-bind(dynamicPadding);
	font-size: v-bind(dynamicFontSize);
	letter-spacing: 2px;
	&.btn-default {
		&-light {
			color: var(--base-font-color);
			border: 1px solid var(--btn-border-color);
			background-color: var(--white-color);
		}
		&-dark {
			color: var(--white-color);
			border: 1px solid var(--border-dark-color);
			background-color: var(--base-dark-bg-color);
		}
		&-dark:hover,
		&-light:hover {
			border: 1px solid var(--primary-color);
		}
	}

	&.btn-primary {
		color: var(--white-color);
		border: 1px solid var(--primary-color);
		background-color: var(--primary-color);
	}
	&.btn-text {
		&-light,
		&-dark {
			border: none;
			background-color: transparent;
			color: var(--primary-color);
		}
	}
	&.btn-text:hover {
		color: var(--base-font-hover-color);
	}
}
</style>
