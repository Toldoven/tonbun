<script setup lang="ts">

import Library from '../components/Library/Library.vue'

import { onMounted, onBeforeMount, ref, onUnmounted } from 'vue';
import { addFullscreenEventListener, loadWindowPrefs, saveWindowPrefs } from '../lib/window';
import { WindowManager, appWindow } from '@tauri-apps/api/window';
import Language from '../components/Language.vue';
import { invoke } from '@tauri-apps/api/tauri';

import { useLibraryCardsStore } from '../stores/libraryCards';
import { usePrefsStore } from '../stores/prefs';

const webview: WindowManager = appWindow
const libraryCards = useLibraryCardsStore()

const setupWindow = async (webview: WindowManager) => {
  await loadWindowPrefs(webview)
  webview.show()

  addFullscreenEventListener(window, webview)

  webview.listen('error', () => {

  })

  webview.once('tauri://close-requested', async () => {

    await Promise.all([
      saveWindowPrefs(webview),
      libraryCards.saveOrder()
    ])

    webview.close()
  })
}

const setLang = (selectedLang: string) => {
  prefs.setLang(selectedLang)
}

const prefs = usePrefsStore()

onMounted(async () => {
  setupWindow(webview)
})

</script>

<template>

<!-- <p>{{ $t('main.welcome', {company: 'Lokalise'}) }}</p> -->

<Library v-if="prefs.value.lang"/>
<Language v-else @setLang="(e: string) => setLang(e)" />

</template>
