<template>
  <div class="picker">
    <div
      class="picker-item"
      v-for="item in props.pickerOptions"
      @click="clickShorts(item)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PickerOptions } from "./constants";
type Props = {
  pickerOptions?: PickerOptions[];
};
const props = defineProps<Props>();
const emit = defineEmits(["selectedPickerOptions"]);

const clickShorts = (item: PickerOptions) => {
  emit("selectedPickerOptions", item);
};
</script>

<style lang="scss" scoped>
.picker {
  min-width: 120px;
  height: 450px;
  border-right: 1px solid #ebeef5;
  padding: 15px 0 0 15px;
  &-item {
    padding: 5px 0;
    cursor: pointer;
    user-select: none;
  }
}
</style>
