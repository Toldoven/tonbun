<script setup lang="ts">

import Library from '../components/Library/Library.vue'

import { onMounted } from 'vue'
import { addFullscreenEventListener, loadWindowPrefs, saveWindowPrefs } from '../lib/window'
import { WindowManager, appWindow, WebviewWindow } from '@tauri-apps/api/window'
import Language from '../components/Language.vue'

import { useLibraryCardsStore } from '../stores/libraryCards'
import { usePrefsStore } from '../stores/prefs'

const webview: WindowManager = appWindow
const libraryCards = useLibraryCardsStore()

const closeReader = async () => {
  const reader = WebviewWindow.getByLabel('reader')
  if (!reader) return
  await reader.close()
}

const setupWindow = async (webview: WindowManager) => {
  await loadWindowPrefs(webview)
  webview.show()

  addFullscreenEventListener(window, webview)

  webview.once('tauri://close-requested', async () => {

    await Promise.all([
      saveWindowPrefs(webview),
      libraryCards.saveOrder(),
      closeReader()
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

<Library v-if="prefs.value.lang" />
<Language v-else @setLang="(e: string) => setLang(e)" />

</template>
