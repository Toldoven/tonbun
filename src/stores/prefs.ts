import { invoke } from "@tauri-apps/api/tauri";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { listen } from "@tauri-apps/api/event"
import { WebviewWindow } from "@tauri-apps/api/window";
// const { t, locale } = useI18n();

export const usePrefsStore = defineStore('prefs', () => {

    const value = ref<any>({})

    const readerWindow = WebviewWindow.getByLabel('reader')

    const loadPrefs = async () => value.value = await invoke('read_prefs')

    listen('update_prefs', (e) => value.value = e.payload)

    const setLang = (lang: string) => invoke('set_lang', { lang })

    const setDiscordRichPresence = async (value: boolean) => {

        await invoke('set_discord_rich_presence_enabled', { value })

        if (value === true) {
            readerWindow.emit('discord_rich_presence_enabled')
            console.log('Emitted')
        }
    }

    const setReaderFormat = (format: String) => invoke('set_reader_format', { format })

    // watch(value, () => {
    //     if (value.value === true) invoke('discord_start_interval')
    // })

    // loadPrefs()

    return { value, setLang, loadPrefs, setDiscordRichPresence, setReaderFormat }
})