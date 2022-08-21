<script setup lang="ts">

import { invoke } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Reader from '../components/Reader/Reader.vue'
import { addFullscreenEventListener, saveWindowPrefs } from '../lib/window'
import { useReaderStore } from '../stores/reader'

const route = useRoute()
const reader = useReaderStore()

const webview = appWindow

onMounted(async () => {
    try {

        addFullscreenEventListener(window, webview)

        webview.once('tauri://close-requested', async () => {
            await Promise.all([
                invoke('set_manga_chapter_and_slide_by_title', {
                    title: route.params.title,
                    chapter: route.params.chapter,
                    slide: parseInt(route.params.slide as string)
                }),
                saveWindowPrefs(webview)
            ])
            webview.hide()
        })

        await reader.getChapterList()
        await reader.updateChapterData()

        webview.show()
        webview.setFocus()

    } catch (e) {
        invoke('message', { message: e })
    }
})

</script>

<template>

<Reader :key="route.params.title as string"/>

</template>