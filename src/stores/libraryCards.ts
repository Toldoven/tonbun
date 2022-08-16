import { invoke } from '@tauri-apps/api/tauri'
import { appWindow, WindowManager } from '@tauri-apps/api/window'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const webview: WindowManager = appWindow

const getMangaCards = (async () => {
    const get_manga_cards: Array<Object> = await invoke('get_manga_cards')
    get_manga_cards.sort((a:any, b:any) => {
      return a.order - b.order || -1
    })
    return get_manga_cards
})

export const useLibraryCardsStore = defineStore('libraryCards', () => {

    // Library

    const value = ref<Array<Object>>([])

    const update = async () => {
        value.value = await getMangaCards()
    }

    const orderList = computed(() => value.value.map((item: any, index: Number) => [item.uuid, index]))

    const saveOrder = async () => {
        await invoke('update_manga_order', { orderList: orderList.value })
    }

    const saveAndUpdate = async () => {
        await saveOrder()
        update()
    }
    
    const deleteMangaByUuid = async (uuid: string) => {
        await invoke('delete_manga_by_uuid', { uuid })
        const find: any = value.value.find((card: any) => card.uuid === uuid)
        const index = value.value.indexOf(find)
        if (index > -1) value.value.splice(index, 1)
    }

    // Downloading

    const downloading = ref<any>({})
    
    const setDownloadingState = (uuid: string, chapter: Number, outOf: Number | undefined) => {

        if (outOf) downloading.value[uuid].outOf = outOf

        if (downloading.value[uuid].chapter) downloading.value[uuid].chapter = chapter

        if (chapter === downloading.value[uuid].outOf) delete downloading.value[uuid]
        
    }

    const startDownloading = (uuid: string) => {
        downloading.value[uuid] = {
            chapter: 0,
            outOf: 0,
        }
    }

    webview.listen('update_download_progress', (event: any) => {
        setDownloadingState(event.payload.uuid, event.payload.progress + 1, undefined)
    })
    
    webview.listen('start_downloading', (event: any) => {
        setDownloadingState(event.payload.uuid, 0, event.payload.out_of),
        saveAndUpdate()
    })

    // Update & Return

    update()

    return { value, saveOrder, update, orderList, saveAndUpdate, downloading, startDownloading, deleteMangaByUuid }
})