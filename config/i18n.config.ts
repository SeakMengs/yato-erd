import English from "~/locale/English";
import Khmer from "~/locale/Khmer";
import { createI18n } from "vue-i18n";
import { DEFAULT_LANGUAGE } from "~/constants/language";

export default defineI18nConfig(() => ({
  legacy: false,
  locales: ["en", "kh"],
  messages: {
    en: English,
    kh: Khmer,
  },
  defaultLocale: DEFAULT_LANGUAGE,
  fallbackLocale: DEFAULT_LANGUAGE,
}));
