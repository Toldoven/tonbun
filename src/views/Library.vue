<script setup lang="ts">

import Library from '../components/Library/Library.vue'

import { onMounted } from 'vue'
import { addFullscreenEventListener, loadWindowPrefs, saveWindowPrefs } from '../lib/window'
import { WindowManager, appWindow, WebviewWindow } from '@tauri-apps/api/window'
import Language from '../components/Language.vue'

import { useLibraryCardsStore } from '../stores/libraryCards'
import { usePrefsStore } from '../stores/prefs'
import { invoke } from '@tauri-apps/api'

const webview: WindowManager = appWindow
const libraryCards = useLibraryCardsStore()

const closeReader = async () => {
  const reader = WebviewWindow.getByLabel('reader')
  if (!reader) return
  await reader.close()
}

const prefs = usePrefsStore()

const setupWindow = async (webview: WindowManager) => {
  try {

    addFullscreenEventListener(window, webview)

    webview.once('tauri://close-requested', async () => {
      await Promise.all([
        saveWindowPrefs(webview),
        libraryCards.saveOrder(),
        closeReader()
      ])
      await invoke('save_prefs')
      webview.close()
    })

    await prefs.loadPrefs()
    
    await loadWindowPrefs(webview, prefs.value)

  } catch (e) {

  } finally {
    webview.show()
  }

}

const setLang = (selectedLang: string) => {
  prefs.setLang(selectedLang)
}

onMounted(async () => {
  setupWindow(webview)
})

</script>



<template>

<Library v-if="prefs.value.lang" />
<Language v-else @setLang="(e: string) => setLang(e)" />

</template>
