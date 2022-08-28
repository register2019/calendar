import { Ref, watch, unref } from "vue";

export function onClickOutSide(target: Ref, handler: () => void) {
  const listener = (event: PointerEvent) => {
    // 获取当前节点
    const el = unref(target);
    const composedPath = event.composedPath();

    if (!el || composedPath.includes(el)) return;

    handler();
  };

  useEventlistener(window, listener);
}

function useEventlistener(...args: any[]) {
  let target: HTMLElement | undefined;
  let listener: () => void;

  [target, listener] = args;

  watch(
    () => target,
    (el) => {
      if (!el) return;
      el.addEventListener("click", listener, { capture: true, passive: true });
    },
    {
      immediate: true,
      flush: "post",
    }
  );
}
