<template>
  <div style="width: 292px">
    <div class="dc-my" v-for="(dates, index) in props.dates" :key="index">
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="props.currDate === date ? 'currDate' : ''"
        @click="selectedDate(date)"
      >
        {{ dynamicComputedDate(date) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";

type Dates = Record<string, string | number>[][] | number[][];

type Props = {
  dates: Dates;
  currDate: number | string;
  i18n?: string;
};

const props = withDefaults(defineProps<Props>(), {
  i18n: "zh",
});

const emit = defineEmits(["emitSelectedYearOrMonth"]);
const selectedDate = (val: number | object) => {
  const { i18n } = props;
  if (typeof val === "object") {
    emit(
      "emitSelectedYearOrMonth",
      (val as Record<string, string | number>).val
    );
  } else {
    emit("emitSelectedYearOrMonth", val);
  }
};

const dynamicComputedDate = (
  params: Record<string, string | number> | number
) => {
  if (typeof params === "number") {
    return params === 0 ? "" : params;
  } else {
    return params[props.i18n];
  }
};
</script>

<style lang="scss" scoped>
.dc-my {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  div {
    width: 100%;
    text-align: center;
    height: 36px;
    line-height: 36px;
    color: #606266;
    margin: 0 auto;
    user-select: none;
    cursor: pointer;
  }
}
.currDate {
  color: var(--primary-color) !important;
  font-weight: 700;
}
</style>
