import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import router from './router'
import { createPinia } from 'pinia'
import ToastService from 'primevue/toastservice';
import VueZoomer from 'vue-zoomer'

import i18n from "./i18n/index";

const Vue = createApp(App)

const pinia = createPinia()

Vue.use(router)
Vue.use(PrimeVue)
Vue.use(pinia)
Vue.use(ToastService)
Vue.use(i18n)
Vue.use(VueZoomer)

Vue.mount('#app')

import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/md-dark-indigo/theme.css'
import 'primeflex/primeflex.css'

import 'swiper/css'
import 'swiper/css/keyboard'
import './assets/fonts.scss'
