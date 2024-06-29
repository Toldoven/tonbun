<script setup lang="ts">

import Library from '../components/Library/Library.vue'

import { onMounted, watch } from 'vue'
import { addFullscreenEventListener } from '../lib/window'
import { WindowManager, appWindow, WebviewWindow, getCurrent } from '@tauri-apps/api/window'
import Language from '../components/Language.vue'

import { useLibraryCardsStore } from '../stores/libraryCards'
import { usePrefsStore } from '../stores/prefs'
import { invoke } from '@tauri-apps/api'
import { message } from '@tauri-apps/api/dialog'

import { useToast } from 'primevue/usetoast'

const webview: WindowManager = getCurrent()
const libraryCards = useLibraryCardsStore()

const toast = useToast()

const closeReader = async () => {
  try {
    const reader = WebviewWindow.getByLabel('reader')
    if (!reader) return
    await reader.close()
  } catch (e) {
    console.error(e)
  }
}

const prefs = usePrefsStore()

const setupWindow = async (webview: WindowManager) => {
  try {

    addFullscreenEventListener(window, webview)

    webview.once('tauri://close-requested', async () => {
      try {
        await Promise.all([
          libraryCards.saveOrder(),
          invoke('set_manga_chapter_and_slide_from_state'),
          invoke('save_prefs'),
        ])
      } catch (e) {
        await message(`Error when trying to close the app: ${e}`);
      } finally {
        await closeReader()
        await webview.close()
      }
    })
    webview.listen<String>('error', (e) => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: e.payload,
        life: 5000,
      })
    }) 
    webview.listen<String>('success', (e) => {
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: e.payload,
        life: 5000,
      })
    }) 

    await prefs.loadPrefs()

  } catch (e) {
    console.error(e)
  } finally {
    await webview.show()
  }

}

const setLang = (selectedLang: string) => {
  prefs.setLang(selectedLang)
}

onMounted(async () => {
  await setupWindow(webview)
  // if prefs.
  // invoke('discord_start_interval')
})

// watch(prefs, () => {
//   if (prefs.value.discord_rich_presence_enabled === true) invoke('discord_start_interval')
// })

</script>



<template>

<Library v-if="prefs.value.lang" />
<Language v-else @setLang="(e: string) => setLang(e)" />

</template>
