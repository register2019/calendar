import { Ref } from "vue";
import { createI18n } from "vue-i18n";
import zh from "./zh";
import en from "./en";
import { useStorage } from "@vueuse/core";

const messages = {
  en,
  zh,
};

export const currentLocale: Ref<string> = useStorage("locale", "zh");

const i18n = createI18n({
  locale: currentLocale.value,
  allowComposition: true,
  messages,
});

export function t(key: string, ...params: any[]) {
  // @ts-ignore
  return i18n.global.t.call(i18n.global, key, ...params);
}

export default i18n;
