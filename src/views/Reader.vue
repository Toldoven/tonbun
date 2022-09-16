<script setup lang="ts">

import { invoke } from '@tauri-apps/api'
import { getCurrent, WebviewWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Reader from '../components/Reader/Reader.vue'
import { addFullscreenEventListener } from '../lib/window'
import { usePrefsStore } from '../stores/prefs'
import { useReaderStore } from '../stores/reader'
// import { useMetaStore } from '../stores/meta'
import { event } from '@tauri-apps/api'
import { useMetaStore } from '../stores/meta'
import { message } from '@tauri-apps/api/dialog'

const route = useRoute()
const reader = useReaderStore()
const prefs = usePrefsStore()
const meta = useMetaStore()
// const meta = useMetaStore()

// import router from "../router"

const webview = getCurrent()

onMounted(async () => {

    try {

        // reader.resetChapterData()

        addFullscreenEventListener(window, webview)

        event.listen('discord_rich_presence_enabled', () => {
            reader.updateDiscordRP()
        })

        webview.listen('tauri://close-requested', async () => {
            try {
                await Promise.all([
                    invoke('set_manga_chapter_and_slide_from_state'),
                    invoke('discord_clear_activity'),
                ]) 
            } catch (e) {
                console.error(e)
                await message(`Error when trying to close manga: ${e}`);
            } finally {
                await webview.hide()
                await reader.push('/read')
            }
        })

        event.listen('change_reader_url_test', async (e: any) => {
            try {

                // await webview.show()
                // await webview.setFocus()

                if (route.params.title) {
                    await Promise.all([
                        invoke('set_manga_chapter_and_slide_from_state'),
                        invoke('discord_clear_activity'),
                    ]) 
                }

                await reader.push(e.payload)

                // reader.timestamp = Date.now()

                await meta.loadMeta()
                await reader.getChapterList()
                await reader.updateChapterData()

                // invoke('message', { message: "hellooooo" })

            } catch (e) {

                console.error(e)

            } finally {

                await webview.show()
                await webview.setFocus()

                const library = WebviewWindow.getByLabel('library')

                await library.emit('manga_loaded')
            }
        })

        await Promise.all([
            // meta.loadMeta(),
            // reader.getChapterList(),
            prefs.loadPrefs(),
        ])

    } catch (e) {
        console.error(e)
        // invoke('message', { message: e })
    } 
    
    // finally {
    //     webview.show()
    //     webview.setFocus()
    // }
})

</script>

<template>

<Reader v-if="route.params.title" key="route.params.title"/>

</template>