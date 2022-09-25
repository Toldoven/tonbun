<script setup lang="ts">

import { invoke } from '@tauri-apps/api'
import { getCurrent, WebviewWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Reader from '../components/Reader/Reader.vue'
import { addFullscreenEventListener } from '../lib/window'
import { usePrefsStore } from '../stores/prefs'
import { useReaderStore } from '../stores/reader'
import { event } from '@tauri-apps/api'
import { message } from '@tauri-apps/api/dialog'
import { Event } from '@tauri-apps/api/event'

const route = useRoute()
const reader = useReaderStore()
const prefs = usePrefsStore()

const webview = getCurrent()

onMounted(async () => {
    try {

        addFullscreenEventListener(window, webview)

        event.listen('discord_rich_presence_enabled', () => reader.updateDiscordRP())

        webview.listen('tauri://close-requested', () => onCloseRequested())

        event.listen<string>('change_reader_url_test', async (e) => onChangeUrl(e))

        await prefs.loadPrefs()

        if (route.params.title) await reader.loadMangaByTitle(route.params.title as string)

    } catch (e) {
        console.error(e)
    } 
})

const onCloseRequested = () => {
    try {
        reader.updateIntegrationChapter()
        reader.setMangaChapterAndSlide()
        invoke('discord_clear_activity')
    } catch (e) {
        console.error(e)
        message(`Error when trying to close manga: ${e}`);
    } finally {
        webview.hide()
        reader.push('/read')
    }
}

const onChangeUrl = async (e: Event<string>) => {
    try {
        if (route.params.title) {
            reader.updateIntegrationChapter()
            await Promise.all([
                reader.setMangaChapterAndSlide(),
                invoke('discord_clear_activity'),
            ]) 
        }
        await reader.push(e.payload)
        await reader.loadMangaByTitle(route.params.title as string)
    } catch (e) {
        console.error(e)
    } finally {
        await webview.show()
        await webview.setFocus()

        const library = WebviewWindow.getByLabel('library')
        await library.emit('manga_loaded')
    }
}

</script>

<template>

<Reader v-if="route.params.title" key="route.params.title"/>

</template>