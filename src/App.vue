<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Toast from 'primevue/toast'
import { usePrefsStore } from './stores/prefs';
import { onBeforeMount, onMounted, watch } from 'vue';
import { invoke } from '@tauri-apps/api';
import { useRoute } from 'vue-router';

const { t, locale } = useI18n();

const prefs = usePrefsStore()
const route = useRoute();

watch(prefs, () => { if (prefs.value.lang) locale.value = prefs.value.lang })

</script>

<template>
  <Toast/>
  <!-- <p>{{route}}</p> -->
  <router-view/>
</template>

<style lang="scss">

// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.p-component {
  font-family: 'Inter', sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  font-family: 'Inter', sans-serif !important;
}

p {
	line-height: 150%;
}

body {
  padding: 0;
  margin: 0;
  color: var(--text-color);
  background-color: var(--surface-ground);
}

html {
  color: var(--text-color);
  background-color: var(--surface-ground);
  // font-family:Roboto, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
}

html, body, #app, main {
  height: 100%;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

// input::placeholder {
//   user-select: none;
//   -webkit-user-select: none;
//   pointer-events: none !important;
//   -webkit-pointer-events: none !important;
// }

// ::placeholder, input::placeholder {
//   pointer-events: none !important;
//   -webkit-pointer-events: none !important;
//   -moz-pointer-events: none;
//   -ms-pointer-events: none;
// }

// input div[pseudo] {
//   pointer-events: none;
//   -webkit-pointer-events: none;
//   -moz-pointer-events: none;
//   -ms-pointer-events: none;
// }

// i {
//   pointer-events: none;
//   -webkit-pointer-events: none;
//   -moz-pointer-events: none;
//   -ms-pointer-events: none;
// }

</style>
