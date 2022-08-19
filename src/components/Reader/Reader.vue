<script setup lang="ts">

import { appWindow } from '@tauri-apps/api/window';
import { onMounted, ref } from 'vue';
import { useReaderStore } from '../../stores/reader'
import Chapter from './Chapter.vue'

import Button from 'primevue/button'
import Listbox, { ListboxChangeEvent } from 'primevue/listbox'

const reader = useReaderStore()

const lastMove = ref(Date.now())
const visible = ref(false)

const webview = appWindow

function handleListClick(e: ListboxChangeEvent) {
    reader.setChapter(e.toString())
//   const indexOf = reader.chapterList.indexOf(e.toString())
//   if (indexOf < 0) return
//   chapter.value = indexOf
//   return indexOf
}

onMounted(async () => {

    window.addEventListener('mousemove', (event) => {
        visible.value = true

        const whenRun = Date.now()
        lastMove.value = whenRun

        setTimeout(async () => {
            if (lastMove.value != whenRun) return
            visible.value = false
        }, 1000)
    })

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
  <Button @click="webview.emit('tauri://close-requested')" v-if="fullscreen" icon="pi pi-times" class="p-button-plain p-button-rounded p-button-text"></Button>
  <Button @click="toggleFullscreen" :icon="`pi ${!fullscreen ? `pi-window-maximize` : `pi-window-minimize`}`" class="p-button-plain p-button-rounded p-button-text"></Button>
</div>

<div class="chapter-info w-10rem absolute z-3 m-3">
<p :class="`mouse-move p-card p-component p-3 mb-2 ${!visible ? `hidden` : ''}`">{{ $route.params.chapter }}</p>
<Listbox
    :modelValue="$route.params.chapter"
    @update:modelValue="handleListClick"
    :options="reader.chapterList"
    class="z-4" style="width:15rem"
    listStyle="height:250px">
</Listbox>
</div>

<Chapter/>

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

</style>