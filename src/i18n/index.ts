
import { createI18n } from 'vue-i18n'
import { en, ru } from './languages'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocae: 'en',
  messages: {
    en,
    ru,
  },
})

export default i18n