import { invoke } from "@tauri-apps/api"
import { appWindow, WindowManager } from "@tauri-apps/api/window"
import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import router from "../router"

const webview: WindowManager = appWindow

export const useReaderStore = defineStore('reader', () => {

    const loadingChapter = ref(true)

    const route = useRoute()

    // Chapter List

    const chapterList = ref<string[]>([])

    const getChapterList = async () => {
        chapterList.value = await invoke('get_chapter_list_by_title', { title: route.params.title })
        chapterList.value.push()
        if (route.params.chapter === '0') router.push({
          path: `/read/${route.params.title}/${chapterList.value[0]}/0`
        })
    }

    // Change chapters

    const indexOfChapter = () => chapterList.value.findIndex((chapter) => chapter === route.params.chapter)

    const nextChapter = () => {
        const index = indexOfChapter()
        const nextChapter = chapterList.value[index + 1]
        if (!nextChapter) return
        router.push(`/read/${route.params.title}/${nextChapter}/0`)
    }
    
    const prevChapter = () => {
        const index = indexOfChapter()
        const prevChapter = chapterList.value[index - 1]
        if (!prevChapter) return
        router.push(`/read/${route.params.title}/${prevChapter}/-1`)
    }

    // Title

    const updateTitle = async () => {
        webview.setTitle(`${route.params.title} - ${route.params.chapter}`)
    }      

    // Chapter Data 

    const chapterData = ref({
        path: '',
        images: [],
    })

    const updateChapterData = async () => {

        loadingChapter.value = true

        chapterData.value = await invoke('get_chapter_by_title', {
            title: route.params.title,
            chapter: route.params.chapter
        })

        updateTitle()

        loadingChapter.value = false
    }

    const currentChapter = computed(() => route.params.chapter)
    
    watch(currentChapter, async (value, oldValue) => {
        if (value === oldValue) return 
        if (['-1', '0'].includes(value as string)) return
        updateChapterData()
    })

    // Slider 

    const changeSlideRoute = (slide: Number) => {
        router.push(`/read/${route.params.title}/${route.params.chapter}/${slide}`)
    }

    const setChapter = (chapter: String) => {
        router.push(`/read/${route.params.title}/${chapter}/0`)
    }

    // Return

    return { chapterList, loadingChapter, getChapterList, updateChapterData, nextChapter, prevChapter, chapterData, changeSlideRoute, setChapter }
})