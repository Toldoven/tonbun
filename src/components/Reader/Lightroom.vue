<script setup lang="ts">

import { ref, computed } from 'vue'

import Image from './Image.vue'

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperClass } from 'swiper/types'
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps<{
  images: Array<string>
  path: string
  startAtSlide: number | false
  startFromEnd: boolean
  lastChapter: boolean
  firstChapter: boolean
  visible: boolean
}>()

const emit = defineEmits(['nextChapter', 'prevChapter', 'slideChange'])

const swiper = ref<SwiperClass | null>(null)
const loading = ref(true)

const setSwiper = (sw: SwiperClass) => {
  // @ts-ignore
  swiper.value = sw;
}

const handleSlideChange = () => emit("slideChange", swiper.value?.activeIndex || 0)

const handleNextSlide = () => {
  if (swiper.value?.isEnd && !props.lastChapter) {
    emit("nextChapter")
    loading.value = true
    return
  }
  swiper.value?.slideNext(speed.value)
}

const handlePrevSlide = () => {
  if (swiper.value?.isBeginning && !props.firstChapter) {
    emit("prevChapter")
    loading.value = true
    return
  }
  swiper.value?.slidePrev(speed.value)
}

window.addEventListener("keyup", async function(e) {
  const keysNext = ['ArrowDown', 'ArrowRight', 'ShiftRight', 'Space', 'KeyD', 'KeyS']
  const keysPrev = ['ArrowUp', 'ArrowLeft', 'ShiftLeft', 'KeyA', 'KeyW']
  if (keysNext.includes(e.code)) handleNextSlide()
  if (keysPrev.includes(e.code)) handlePrevSlide()
})

window.addEventListener("wheel", async function(e) {
  const check = ['control-bottom', 'control-top']
  const target = e.target as Element;
  if (!check.includes(target.id)) return
  e.preventDefault()

  const b = e.deltaY > 0
  if (b) handleNextSlide()
  else handlePrevSlide()
})

const initialLoad = ref(true)

const initialSlide = computed(() => {
  if (initialLoad.value && props.startAtSlide) return props.startAtSlide
  return props.startFromEnd ? Infinity : 0
})

const afterInit = () => {
  loading.value = false
  setTimeout(() => initialLoad.value = false, 250)
}

const currentSlide = (swiperIndex: number) => {
  if (swiperIndex == Infinity) return props.images.length
  return swiperIndex + 1
}

const speed = ref(300)
const touchMove = true

</script>


<template>

<div class="relative w-full h-full">

  <div class="absolute controls w-full h-screen" v-if="!loading">
    <!-- <div @click="handlePrevSlide()" class="absolute left-0 w-6 h-screen z-2"></div>
    <div @click="handleNextSlide()" class="absolute right-0 w-6 h-screen z-2"></div> -->
    <div 
      id="control-top"
      @click="handlePrevSlide()"
      class="absolute top- w-screen z-2"
      style="height: 50%"/>
    <div
      id="control-bottom"
      @click="handleNextSlide()"
      class="absolute bottom-0 w-screen z-2"
      style="height: 50%"/>
  </div>

  <p class="opacity-50 p-card p-component p-2 absolute bottom-0 right-0 m-3 z-3">
    {{`${currentSlide(swiper?.activeIndex || 0)} / ${props.images.length}`}}
  </p>

  <div v-show="!loading">
    <Swiper
      @swiper="setSwiper"
      @active-index-change="handleSlideChange"
      @after-init="afterInit"
      :key="props.path"
      :initialSlide="initialSlide"
      :slides-per-view="1"
      :space-between="12"
      :allow-touch-move="touchMove"
      direction="vertical"
      :observer="true"
      :speed="speed"
    >
      <SwiperSlide v-for="image in props.images" :key="`${props.path}/${image}`">
        <Image :key="`${props.path}/${image}`" :localImage="`${path}/${image}`">
      </Image></SwiperSlide>
    </Swiper>
  </div>

  <div class="absolute top-0 w-full h-screen flex align-items-center justify-content-center">
    <ProgressSpinner strokeWidth="4"/>
  </div>

</div>

</template>


<style>

.swiper {
  height: 100vh;
}

</style>