import { StartDownloadingPayload } from './../../src-tauri/bindings/StartDownloadingPayload';
import { UpdateProgressPayload } from './../../src-tauri/bindings/UpdateProgressPayload';
import { MangaCard } from '@rs-ts/MangaCard'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow, WindowManager } from '@tauri-apps/api/window'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const webview: WindowManager = appWindow

const getMangaCards = (async () => {
    return (await invoke<Array<MangaCard>>('get_manga_cards')).sort((a, b) => {
      return a.order - b.order || -1
    })
})

export const useLibraryCardsStore = defineStore('libraryCards', () => {

    // Library

    const value = ref<Array<MangaCard>>([])

    const loading = ref<boolean>(false)

    const update = async () => {
        value.value = await getMangaCards()
    }

    const orderList = computed(() => value.value.map((item: MangaCard, index: Number) => [item.uuid, index]))

    const saveOrder = async () => {
        await invoke('update_manga_order', { orderList: orderList.value })
    }

    const saveAndUpdate = async () => {
        await saveOrder()
        update()
    }
    
    const deleteMangaByUuid = async (uuid: string) => {
        try {
            await invoke('delete_manga_by_uuid', { uuid })
            const find = value.value.find((card: MangaCard) => card.uuid === uuid)
            const index = value.value.indexOf(find)
            if (index > -1) value.value.splice(index, 1)
        } catch (e) {
            console.error(e)
        }
    }

    // Downloading
    
    type Downloading = {
        uuid: string,
        chapter: Number,
        outOf: Number,
    }

    const downloading = ref<object>({})
    
    const setDownloadingState = (uuid: string, chapter: Number, outOf: Number | undefined) => {
        if (outOf) downloading.value[uuid].outOf = outOf
        if (downloading.value[uuid]) downloading.value[uuid].chapter = chapter
        if (chapter === downloading.value[uuid].outOf) delete downloading.value[uuid]
    }

    const startDownloading = (uuid: string) => {
        downloading.value[uuid] = {
            chapter: 0,
            outOf: 0,
        }
    }

    webview.listen<UpdateProgressPayload>('update_download_progress', (event) => {
        setDownloadingState(event.payload.uuid, event.payload.progress + 1, undefined)
    })
    
    webview.listen<StartDownloadingPayload>('start_downloading', (event) => {
        setDownloadingState(event.payload.uuid, 0, event.payload.out_of),
        saveAndUpdate()
    })

    // Update & Return

    update()

    return { value, loading, saveOrder, update, orderList, saveAndUpdate, downloading, startDownloading, deleteMangaByUuid }
})