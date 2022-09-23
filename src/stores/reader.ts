import { fileName, msg } from "@/lib"
import { Manga } from "@rs-ts/Manga"
import { MangaMeta } from "@rs-ts/MangaMeta"
import { invoke } from "@tauri-apps/api"
import { listen } from "@tauri-apps/api/event"
import { getCurrent, WindowManager } from "@tauri-apps/api/window"
import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"
import { useRoute } from "vue-router"
import router from "../router"

const webview: WindowManager = getCurrent()

export const useReaderStore = defineStore('reader', () => {

    const loadingChapter = ref(false)

    const route = useRoute()

    const mangaTimestamp = ref(Date.now())

    // Chapter List

    const manga = ref<Manga>()

    const chapterList = computed(() => getChapterList())

    const getChapterList = () => manga?.value?.chapters.map((chapter) => fileName(chapter.path))

    const chapter = computed((value) => {
        return manga?.value?.chapters.find((chapter) =>
            fileName(chapter.path) === route?.params?.chapter
        )
    })

    const loadMangaByTitle = async (title: string) => {

        mangaTimestamp.value = Date.now()

        manga.value = await invoke<Manga>('get_manga_by_title', { title })

        if (!route?.params?.chapter) return

        const chapterList = getChapterList()
        if (route.params.chapter === '0') setChapter(chapterList[0])
        if (!chapter.value) setChapter(chapterList[0])
    }

    watch(chapter, () => {
        updateTitle()
        updateDiscordRP()
    })

    listen<MangaMeta>('update_meta', (e) => manga.value.meta = e.payload)

    //

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

    //

    const updateTitle = async () => {
        webview.setTitle(`${route.params.title} - ${route.params.chapter}`)
    }      

    const updateDiscordRP = async () => {

        if (!route.params.title || !route.params.chapter) return

        await invoke('discord_set_activity', {
            details: "Reading manga",
            state: `${route.params.title} - ${route.params.chapter}`,
            timestamp: mangaTimestamp.value,
            image: "logo",
        })
    }

    watch(route, async() => {

        if (!route.params.title || !route.params.chapter) return

        invoke('set_reader_state', {
            title: route.params.title as string || "",
            chapter: route.params.chapter as string || "0",
            slide: parseInt(route.params.slide as string) || 0,
        })

    }, { immediate: true })

    const setMangaChapterAndSlide = async () => {
        await invoke('set_manga_chapter_and_slide_by_title', {
            title: route.params.title as string || "",
            chapter: route.params.chapter as string || "0",
            slide: parseInt(route.params.slide as string) || 0
        })
    }

    const updateIntegrationChapter = async () => {
        let anilistMangaId = manga?.value?.meta?.integration?.anilist
        let progress = indexOfChapter()
        
        if (!anilistMangaId && progress >= 0) return 

        await invoke('anilist_update_manga', {
            anilistMangaId,
            progress: progress + 1,
        })
    }

    // 

    const changeSlideRoute = (slide: Number) => {
        // msg(slide)
        router.push(`/read/${route.params.title}/${route.params.chapter}/${slide}`)
    }

    const setChapter = (chapter: String) => {
        console.log(chapter)
        router.push(`/read/${route.params.title}/${chapter}/0`)
    }

    const push = async (url: string) => {
        await router.push(url)
    }

    //

    return { updateIntegrationChapter, setMangaChapterAndSlide, nextChapter, prevChapter, manga, chapter, chapterList, loadMangaByTitle, loadingChapter, changeSlideRoute, setChapter, updateDiscordRP, push, mangaTimestamp }
})