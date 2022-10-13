<template>
  <div
    class="picker"
    v-for="item in props.pickerOptions"
    @click="clickShorts(item)"
  >
    {{ item.text }}
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import { PickerOptions } from "./constants";
type Props = {
  pickerOptions?: PickerOptions[];
};
const props = defineProps<Props>();
const emit = defineEmits(["selectedPickerOptions"]);

const clickShorts = (item) => {
  emit("selectedPickerOptions", item);
};
</script>

<style lang="scss" scoped>
.picker {
  width: 120px;
}
</style>
