<template>
  <input type="text" class="dc-input" autocomplete="off" v-model="modelValue" />
</template>

<script lang="ts">
export default {
  name: "defaultInput",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, computed, Ref, onMounted } from "vue";

type Props = {
  modelValue: string;
};
defineProps<Props>();
</script>

<style lang="scss" scoped>
.dc-input {
  outline: none;
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
}
</style>
