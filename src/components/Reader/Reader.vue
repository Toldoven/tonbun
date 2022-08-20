<script setup lang="ts">

import { appWindow } from '@tauri-apps/api/window';
import { onMounted, ref } from 'vue';
import { useReaderStore } from '../../stores/reader'
import Chapter from './Chapter.vue'

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

const reader = useReaderStore()

const lastMove = ref(Date.now())
const visible = ref(false)

const webview = appWindow

const handleListClick = (e) => reader.setChapter(e.value)

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

<div :class="`mouse-move fixed flex gap-2 flex-row-reverse z-3 right-0 m-3 ${!visible ? `hidden` : ''}`">
  <Button @click="webview.emit('tauri://close-requested')" v-if="fullscreen" icon="pi pi-times" class="p-button-plain p-button-rounded p-button-text"></Button>
  <Button @click="toggleFullscreen" :icon="`pi ${!fullscreen ? `pi-window-maximize` : `pi-window-minimize`}`" class="p-button-plain p-button-rounded p-button-text"></Button>
  <!-- <Button @click="" icon="pi pi-cog" class="p-button-plain p-button-rounded p-button-text"></Button> -->
</div>

<div :class="`mouse-move w-12rem fixed z-3 m-3 ${!visible ? `hidden` : ''}`">
  <Dropdown
    :modelValue="$route.params.chapter"
    @change="handleListClick"
    :options="reader.chapterList"
    class="z-4 w-full "
  ></Dropdown>

<!-- <p :class="`mouse-move p-card p-component p-3 mb-2 ${!visible ? `hidden` : ''}`">{{ $route.params.chapter }}</p>
<Listbox
    :modelValue="$route.params.chapter"
    @update:modelValue="handleListClick"
    :options="reader.chapterList"
    class="z-4" style="width:15rem"
    listStyle="height:250px">
</Listbox> -->
</div>

<Chapter/>

</template>


<style lang="scss">

.pi-cog {
  font-size: 1.5rem !important;
}

// .chapter-info {
//   p {
//     width: fit-content;
//     opacity: 0.8;
//   }
//   .p-listbox {
//     opacity: 0;
//     transition: opacity 500ms !important;
//   }
//   &:hover {
//     p {
//       opacity: 0.8 !important;
//     }
//     .p-listbox {
//       opacity: 0.9;
//       display: block;
//     }
//   }
// }

.mouse-move {
  opacity: 0.9;
  transition: opacity 300ms;
  &.hidden {
    opacity: 0;
  }
}

</style>