<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Toast from 'primevue/toast'
import { usePrefsStore } from './stores/prefs';
import { onMounted, watch } from 'vue';

const { t, locale } = useI18n();

const prefs = usePrefsStore()

prefs.loadPrefs()

watch(prefs, () => {
  if (prefs.value.lang) locale.value = prefs.value.lang
})

</script>

<template>
  <Toast/>
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

</style>
