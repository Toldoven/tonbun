<script setup lang="ts">

import { getCurrent } from '@tauri-apps/api/window';
import { computed, onMounted, ref, watch} from 'vue';
import { useReaderStore } from '../../stores/reader'
import Chapter from './Chapter.vue'

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import OverlayPanel from 'primevue/overlaypanel'
import Menu from './Menu.vue';
import { fileName } from '@/lib';

const reader = useReaderStore()

const lastMove = ref(Date.now())
const visible = ref(false)

const webview = getCurrent()
const menu = ref(null)

const dropdown = ref(null)

const isDropdownShown = ref(false)
const isMenuShown = ref(false)

const handleListClick = (e) => reader.setChapter(e.value)

onMounted(async () => {

    window.addEventListener('mousemove', (event) => {
        visible.value = true

        const whenRun = Date.now()
        lastMove.value = whenRun

        setTimeout(async () => {
            if (lastMove.value != whenRun) return
            if (isDropdownShown.value || isMenuShown.value) return

            visible.value = false
            dropdown?.value?.hide()
        }, 1500)
    })

    fullscreen.value = await webview.isFullscreen()

})

const fullscreen = ref(false)

const removeFocus = () => (document.activeElement as HTMLElement).blur()

const toggleFullscreen = () => {
    removeFocus()
    fullscreen.value = !fullscreen.value
    webview.setFullscreen(fullscreen.value)
}

const toggleMenu = (event) => {
    removeFocus()
    menu.value.toggle(event)
}

const closeWindow = () => {
  removeFocus()
  webview.emit('tauri://close-requested')
}

watch(isDropdownShown, () => removeFocus())

</script>


<template>

<div :class="`reader-buttons mouse-move fixed flex gap-2 flex-row-reverse z-3 right-0 m-3 ${!visible ? `hidden` : ''}`">
  <Button @click="closeWindow" tab-v-if="fullscreen" icon="pi" class="p-button-plain p-button-rounded p-button-text">
      <span class="material-symbols-outlined">close</span>
  </Button>
  <Button @click="toggleFullscreen" icon="pi" class="p-button-plain p-button-rounded p-button-text" :tabindex="-1">
      <span class="material-symbols-outlined" v-if="!fullscreen">fullscreen</span>
      <span class="material-symbols-outlined" v-else>fullscreen_exit</span>
  </Button>
  <Button @click="toggleMenu" icon="pi pi-cog" class="p-button-plain p-button-rounded p-button-text">
      <span class="material-symbols-outlined">settings</span>
  </Button>
</div>

<OverlayPanel ref="menu" :popup="true" @show="isMenuShown=true" @hide="isMenuShown=false">
  <Menu/>
</OverlayPanel>

<div :class="`mouse-move w-12rem fixed z-3 m-3 ${!visible ? `hidden` : ''}`">
  <Dropdown
    :modelValue="$route.params.chapter"
    @change="handleListClick"
    @show="isDropdownShown = true"
    @hide="isDropdownShown = false"
    :options="reader.chapterList"
    class="z-4 w-full "
    ref="dropdown"
  ></Dropdown>
</div>

<Chapter />

</template>


<style lang="scss">

.reader-buttons {
  mix-blend-mode: difference !important;
}

.pi-cog {
  font-size: 1.5rem !important;
}

.mouse-move {
  opacity: 0.9;
  transition: opacity 300ms;
  &.hidden {
    opacity: 0;
  }
}

</style>