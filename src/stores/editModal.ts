import { invoke } from '@tauri-apps/api/tauri';
import { defineStore } from "pinia"
import { ref, watch } from "vue"

export const useEditModalStore = defineStore('editModal', () => {
    const value = ref(false)

    const manga = ref({
        uuid: '',
        title: '',
    })

    const meta = ref(undefined)

    watch(manga, async () => {
        meta.value = await invoke('get_manga_meta_by_title', { title: manga.value.title })
    })

    return { value, manga, meta }
})