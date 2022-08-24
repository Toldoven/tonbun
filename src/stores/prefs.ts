import { invoke } from "@tauri-apps/api/tauri";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { listen } from "@tauri-apps/api/event"
// const { t, locale } = useI18n();



export const usePrefsStore = defineStore('prefs', () => {

    const value = ref<any>({})

    const loadPrefs = async () => value.value = await invoke('read_prefs')

    listen('update_prefs', (e) => value.value = e.payload)

    const setLang = (lang: string) => invoke('set_lang', { lang })

    // loadPrefs()

    return { value, setLang, loadPrefs }
})