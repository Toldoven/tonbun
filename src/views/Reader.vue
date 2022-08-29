<script setup lang="ts">

import { invoke } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Reader from '../components/Reader/Reader.vue'
import { addFullscreenEventListener, loadWindowPrefs, saveWindowPrefs } from '../lib/window'
import { usePrefsStore } from '../stores/prefs'
import { useReaderStore } from '../stores/reader'
import { event } from '@tauri-apps/api'

const route = useRoute()
const reader = useReaderStore()
const prefs = usePrefsStore()

const webview = appWindow

onMounted(async () => {
    try {

        reader.resetChapterData()

        addFullscreenEventListener(window, webview)

        event.listen('discord_rich_presence_enabled', () => {
            console.log('Hello')
            reader.updateDiscordRP()
        })

        webview.once('tauri://close-requested', async () => {
            await Promise.all([
                invoke('set_manga_chapter_and_slide_by_title', {
                    title: route.params.title,
                    chapter: route.params.chapter,
                    slide: parseInt(route.params.slide as string)
                }),
                invoke('discord_clear_activity'),
                saveWindowPrefs(webview)
            ])
            webview.hide()
        })

        await Promise.all([
            reader.getChapterList(),
            prefs.loadPrefs().then(() => loadWindowPrefs(webview, prefs.value)),
        ])

    } catch (e) {
        invoke('message', { message: e })
    } finally {
        webview.show()
        webview.setFocus()
    }
})

</script>

<template>

<Reader :key="route.params.title as string"/>

</template>