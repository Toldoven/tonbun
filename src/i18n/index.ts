
import { createI18n } from "vue-i18n";
import messages from "./messages";

console.log(JSON.stringify(messages));

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocae: 'en',
  messages,
});

export default i18n;