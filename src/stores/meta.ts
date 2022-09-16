import { invoke } from '@tauri-apps/api/tauri'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { listen } from '@tauri-apps/api/event'

export const useMetaStore = defineStore('meta', () => {

    const route = useRoute()

    const value = ref(undefined)

    const loadMeta = async () => {
        value.value = await invoke('get_manga_meta_by_title', { title: route.params.title })
    }

    listen('update_meta', (e) => {
        value.value = e.payload
        console.log(e.payload)
    })

    return { value, loadMeta }
    
})