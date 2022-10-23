<template>
  <div style="width: 292px">
    <div class="dc-my" v-for="(dates, index) in props.dates" :key="index">
      <div
        v-for="(date, index) in dates"
        :key="index"
        :class="props.currDate === date ? 'currDate' : ''"
        @click="selectedDate(date)"
      >
        {{ date === 0 ? "" : date }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { log } from "console";
import { ref, reactive, watch, computed } from "vue";
import { CASECONVERSION } from "../constants";
import { primaryColor } from "../../../utils";
type Props = {
  dates: (number | string)[][];
  currDate: number | string;
};

const props = defineProps<Props>();

const emit = defineEmits(["emitSelectedYearOrMonth"]);
const selectedDate = (val: number | string) => {
  if (typeof val === "string") {
    emit(
      "emitSelectedYearOrMonth",
      CASECONVERSION.find((item) => item.name === val)!.val
    );
  } else {
    emit("emitSelectedYearOrMonth", val);
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
  color: v-bind(primaryColor) !important;
  font-weight: 700;
}
</style>
