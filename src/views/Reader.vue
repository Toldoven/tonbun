<script setup lang="ts">

import { invoke } from '@tauri-apps/api'
import { getCurrent } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Reader from '../components/Reader/Reader.vue'
import { addFullscreenEventListener, loadWindowPrefs, saveWindowPrefs } from '../lib/window'
import { usePrefsStore } from '../stores/prefs'
import { useReaderStore } from '../stores/reader'
import { useMetaStore } from '../stores/meta'
import { event } from '@tauri-apps/api'

const route = useRoute()
const reader = useReaderStore()
const prefs = usePrefsStore()
const meta = useMetaStore()

// import router from "../router"

const webview = getCurrent()

onMounted(async () => {
    try {

        reader.resetChapterData()

        addFullscreenEventListener(window, webview)

        event.listen('discord_rich_presence_enabled', () => {
            reader.updateDiscordRP()
        })

        event.once('tauri://close-requested', async () => {
            await Promise.all([
                invoke('set_manga_chapter_and_slide_by_title', {
                    title: route.params.title,
                    chapter: route.params.chapter,
                    slide: parseInt(route.params.slide as string)
                }),
                invoke('discord_clear_activity'),
                saveWindowPrefs(webview)
            ])
            webview.close()
        })

        event.listen('change_reader_url_test', async (e: any) => {
            await webview.hide()

            await invoke('set_manga_chapter_and_slide_by_title', {
                title: route.params.title,
                chapter: route.params.chapter,
                slide: parseInt(route.params.slide as string)
            }),
            await saveWindowPrefs(webview)

            await reader.push(e.payload)
            await reader.getChapterList()

            await webview.show()
            await webview.setFocus()
        })

        await Promise.all([
            meta.loadMeta(),
            reader.getChapterList(),
            prefs.loadPrefs(),
        ])

    } catch (e) {
        console.error(e)
        // invoke('message', { message: e })
    } finally {
        webview.show()
        webview.setFocus()
    }
})

</script>

<template>

<Reader :key="route.params.title as string"/>

</template>