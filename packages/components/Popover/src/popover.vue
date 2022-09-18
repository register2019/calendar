<template>
  <span @click="showContent" class="trigger" ref="triggerRef">
    <slot></slot>
  </span>
  <Teleport :disabled="isDisabled" to="#tooltip-list">
    <div
      ref="contentRef"
      :style="tooltipStyle"
      class="tooltipStyle"
      @click="clickContent"
    >
      <slot name="content"> </slot>
      <div class="footer" v-if="showFooter">
        <button @click="closeClick">{{ closeBtn }}</button>
        <button @click="submitClick">{{ submitBtn }}</button>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
export default {
  name: "DefaultPopover",
};
</script>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed, CSSProperties } from "vue";
import { tooltipPosition } from "../../../utils";

const contentRef = ref();
const triggerRef = ref();

const tooltipStyle = ref<CSSProperties>({
  display: "none",
});

type Props = {
  closeBtn?: string;
  submitBtn?: string;
  showFooter?: boolean;
  isDisabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  closeBtn: "取消",
  submitBtn: "确认",
  showFooter: true,
  isDisabled: false,
});

const emit = defineEmits(["contentClosed"]);

const showContent = (e: any) => {
  e.stopPropagation();

  const { position } = tooltipPosition(triggerRef.value);

  if (contentRef.value.style.display === "none") {
    toolTipNone();

    contentRef.value.style.display = "block";
    tooltipStyle.value = {
      position: "absolute",
      top: position + "px",
      backgroundColor: "#fff",
    };
  } else {
    contentRef.value.style.display = "none";
  }
};

if (!document.getElementById("tooltip-list")) {
  const oContainer = document.createElement("div");
  oContainer.id = "tooltip-list";
  document.body.appendChild(oContainer);
}

const clickContent = (e: any) => {
  e.stopPropagation();
};
onMounted(() => {
  document.addEventListener("click", (e: any) => {
    toolTipNone();
    if (tooltipStyle.value.display === "block") {
      tooltipStyle.value = {
        display: "none",
      };
      emit("contentClosed", true);
    }
  });
});

const toolTipNone = () => {
  if (!props.isDisabled) {
    const oDoms = document.getElementById("tooltip-list")?.children!;
    Array.from(oDoms).forEach((oDom) => {
      if ((oDom as HTMLDivElement).style.display !== "none") {
        (oDom as HTMLDivElement).style.display = "none";
      }
    });
  }
};

const closeClick = () => {
  contentRef.value.style.display = "none";
  emit("contentClosed", true);
};
const submitClick = () => {
  contentRef.value.style.display = "none";
  emit("contentClosed", true);
};
</script>

<style scoped>
.trigger {
  display: inline-flex;
}
.footer {
  padding: 10px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: right;
}
.footer button {
  background-color: #fff;
  margin: 0 0 0 10px;
  border: 1px solid #ebeef5;
  padding: 8px 15px;
  border-radius: 5px;
  letter-spacing: 2px;
}
.footer button:hover {
  border: 1px solid #c6e2ff;
  background-color: #ecf5ff;
  color: #409eff;
}
.tooltipStyle {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
  min-width: 80px;
  padding: 10px;
}
.tooltipStyle::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #ebeef5;
  top: -6px;
  left: 20%;
  transform: rotate(45deg);
  border-bottom-color: #fff;
  border-right-color: #fff;
  background-color: #fff;
}
</style>
