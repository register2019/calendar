<template>
  <span class="dc-calendar-header-input">
    <span>
      <DefaultInput size="small" v-model="date" :disabled="inputIsDisabled" />
    </span>
    <span>
      <DefaultTimeSelect
        v-if="timeType === 'Select'"
        size="small"
        v-model="time"
      />
      <DefaultTimePicker
        v-else
        size="small"
        v-model="time"
        :disabled="inputIsDisabled"
      />
    </span>
  </span>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import DefaultInput from "../../Input/src/input.vue";
import DefaultTimeSelect from "../../TimeSelect/src/time-select.vue";
import DefaultTimePicker from "../../TimePicker/src/time-picker.vue";

type Props = {
  timeType?: string;
  inputIsDisabled?: boolean;
  date: string;
  time?: string;
};

const props = withDefaults(defineProps<Props>(), {
  timeType: "Picker",
  inputIsDisabled: false,
  date: "",
});
const emit = defineEmits(["update:date", "update:time"]);

watch(
  () => props.date,
  (val) => {
    emit("update:date", val);
  }
);
watch(
  () => props.time,
  (val) => {
    emit("update:time", val);
  }
);
</script>

<style lang="scss" scoped>
.dc-calendar-header-input {
  display: table-cell;
  span {
    display: table-cell;
    padding: 0 5px;
  }
}
</style>
