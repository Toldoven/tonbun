import { invoke } from "@tauri-apps/api"
import { defineStore } from "pinia"
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

export const useReaderSettingsStore = defineStore('readerSettings', () => {

    const format = ref(undefined)
    const route = useRoute()

    const formats = [
        'Default',
        'Slides',
        'Longstrip',
    ]

    const updateFormat = async (value) => {
        await invoke('set_manga_format_by_title', { title: route.params.title, format: value });
    }

    // watch(format, async (value) => {
    //     await invoke('set_manga_format_by_title', { title: route.params.title, format: value });
    // })

    return { format, formats, updateFormat }

})