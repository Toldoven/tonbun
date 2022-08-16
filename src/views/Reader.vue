<!-- <script defer lang="ts">

</script> -->

<script setup lang="ts">

import { appWindow, WindowManager } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/tauri'

import { computed, ComputedRef, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Listbox, { ListboxChangeEvent } from 'primevue/listbox'
import Button from 'primevue/button'

import Lightroom from '../components/Reader/Lightroom.vue'
import { addFullscreenEventListener, saveWindowPrefs } from '../lib/window'

const route = useRoute()

// const startAtSlide: ComputedRef<number>  = computed(() => {
//   if (route.query.slide && typeof(route.query.slide) == 'string') return parseInt(route.query.slide)
//   else return 0
// })

const chapter = ref<number>((() => {
  if (route.query.chapter && typeof(route.query.chapter) == 'string') return parseInt(route.query.chapter)
  else return 0
})())

const slide = ref<number>((() => {
  if (route.query.slide && typeof(route.query.slide) == 'string') return parseInt(route.query.slide)
  else return 0
})())

// invoke("message", { message: `Initial ${slide.value}` })

const selectedChapter = computed(() => chapterList.value[chapter.value] || '')
const chapterList = ref<string[]>([])

const webview = appWindow

const lastChapter: ComputedRef<boolean> = computed(() => chapter.value + 1 == chapterList.value.length)
const firstChapter: ComputedRef<boolean> = computed(() => chapter.value == 0)
const initialLoad = ref(true)

const path = ref('')
const images = ref([])

const startFromEnd = ref(false);

const lastMove = ref(Date.now())
const visible = ref(false)

const setupWindow = async (webview: WindowManager) => {
  try {

    webview.show()

    addFullscreenEventListener(window, webview)

    webview.once('tauri://close-requested', async () => {
      await Promise.all([
        invoke('set_manga_chapter_and_slide_by_uuid', {
          uuid: route.params.uuid,
          chapter: chapter.value,
          slide: slide.value
        }),
        saveWindowPrefs(webview)
      ])
      webview.close()
    })

    window.addEventListener('mousemove', (event) => {

      visible.value = true

      const whenRun = Date.now()
      lastMove.value = whenRun

      setTimeout(async () => {
        if (lastMove.value != whenRun) return
        visible.value = false
      }, 1000)

    })
    
  } catch (e) {
    invoke('message', { message: e })
  }
}

const getChapterList = async () => {
  chapterList.value = await invoke('get_chapter_list_by_uuid', { uuid: route.params.uuid })
  chapterList.value.push()
}

const setChapter = async () => {
  const loadChapter: any = await invoke('get_chapter_by_uuid', { uuid: route.params.uuid, index: chapter.value })
  updateTitle()

  path.value = loadChapter.path
  images.value = loadChapter.images
  images.value.push()
}

watch(chapter, () => setChapter(), { immediate: true })

const handleSlideChange = async (n: number) => {
  // await invoke("message", { message: `Change ${slide.value}` })
  slide.value = n
}

const updateTitle = async () => {
  if (!route.query.title) webview.setTitle(`Tonbun`)
  else if (selectedChapter.value) webview.setTitle(`${route.query.title} - ${selectedChapter.value}`)
  else webview.setTitle(`${route.query.title}`)
}

function handleNextChapter() {
  if (chapter.value + 1 > chapterList.value.length) return
  startFromEnd.value = false
  chapter.value++
}

function handlePrevChapter() {
  if (chapter.value - 1 < 0) return
  startFromEnd.value = true
  chapter.value--
}


function handleListClick(e: ListboxChangeEvent) {
  const indexOf = chapterList.value.indexOf(e.toString())
  if (indexOf < 0) return chapter.value
  startFromEnd.value = false
  chapter.value = indexOf
  return indexOf
}

// watch(chapter, (value) => console.log(value))

// onBeforeMount(async () => {

//   if (route.query.chapter && typeof(route.query.chapter) == 'string') chapter.value = parseInt(route.query.chapter)
//   else chapter.value = 0

// })

onMounted(async () => {
  getChapterList().then(() => {
    updateTitle()
  })
  await setupWindow(webview)
  fullscreen.value = await webview.isFullscreen()
})

const fullscreen = ref(false)

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value
  webview.setFullscreen(fullscreen.value)
}

</script>


<template>

<div :class="`mouse-move absolute flex gap-2 flex-row-reverse z-3 right-0 m-3 ${!visible ? `hidden` : ''}`">
  <Button @click="webview.close()" v-if="fullscreen" icon="pi pi-times" class="p-button-plain p-button-rounded p-button-text"></Button>
  <Button @click="toggleFullscreen" :icon="`pi ${!fullscreen ? `pi-window-maximize` : `pi-window-minimize`}`" class="p-button-plain p-button-rounded p-button-text"></Button>
</div>

<div v-if="chapterList.length > 0" class="relative">
  <div class="chapter-info w-10rem absolute z-3 m-3">
    <p :class="`mouse-move p-card p-component p-3 mb-2 ${!visible ? `hidden` : ''}`">{{selectedChapter}}</p>
    <Listbox
      :modelValue="chapter"
      @update:modelValue="handleListClick"
      :options="chapterList"
      class="z-4" style="width:15rem"
      listStyle="height:250px">
    </Listbox>
  </div>
  <Lightroom
    :images="images"
    :path="path"
    @nextChapter="handleNextChapter"
    @prevChapter="handlePrevChapter"
    @slideChange="handleSlideChange"
    :startFromEnd="startFromEnd"
    :startAtSlide="slide"
    :initialLoad="initialLoad"
    :lastChapter="lastChapter"
    :firstChapter="firstChapter"
    :visible="visible"
  />
</div>

<!-- <p>{{ title }}</p> -->

</template>


<style lang="scss">

.chapter-info {
  p {
    width: fit-content;
    opacity: 0.8;
    // &.hidden {
    //   ba
    //   opacity: 1 !important;
    // }
  }
  .p-listbox {
    opacity: 0;
    transition: opacity 500ms !important;
  }
  &:hover {
    p {
      opacity: 0.8 !important;
    }
    .p-listbox {
      opacity: 0.9;
      // transition: opacity 1000ms;
      display: block;
    }
  }
}

.mouse-move {
  opacity: 1;
  // transition: opacity 300ms !important;
  &.hidden {
    opacity: 0;
  }
}

/* .p-listbox {
  width: 15rem;
  height: 100px;
  overflow: hidden;
} */

</style>