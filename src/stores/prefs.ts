import { invoke } from "@tauri-apps/api/tauri";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// const { t, locale } = useI18n();

export const usePrefsStore = defineStore('prefs', () => {

    const value = ref<any>({})

    const loadPrefs = async () => {
        value.value = await invoke('load_prefs')
    }

    const savePrefs = async () => {
        await invoke('save_prefs', { prefs: value.value })
    }

    const setLang = (lang: string) => {
        value.value.lang = lang
        savePrefs()
    }

    // loadPrefs()

    return { value, setLang, loadPrefs }
})