<script setup lang="ts">

import { ref, computed } from 'vue'

import ProgressSpinner from 'primevue/progressspinner';

import Image from './Image.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Swiper as SwiperClass } from 'swiper/types'

import { useRoute } from 'vue-router'
import { useReaderStore } from '../../stores/reader'
import { msg } from '@/lib';

const route = useRoute()
const reader = useReaderStore()
const swiper = ref<SwiperClass | null>(null)

const speed = ref(300)

const setSwiper = (sw: SwiperClass) => swiper.value = sw

const handleSlideChange = () => {
  const activeIndex = swiper.value?.activeIndex
  if (activeIndex !== undefined) reader.changeSlideRoute(activeIndex)
}

const initialSlide = computed(() => {
  const slide = parseInt(route.params.slide as string)
  return slide >= 0 ? slide : Infinity
})

const currentSlide = (swiperIndex: number) => {
  if (swiperIndex == Infinity) return reader.chapter.images.length
  return swiperIndex + 1
}

// Next / Prev 

const handleNextSlide = () => {
  if (reader.loadingChapter) return
  if (swiper.value?.isEnd) {
    reader.nextChapter()
    return
  }
  swiper.value?.slideNext(speed.value)
}

const handlePrevSlide = () => {
  if (reader.loadingChapter) return
  if (swiper.value?.isBeginning) {
    reader.prevChapter()
    return
  }
  swiper.value?.slidePrev(speed.value)
}

// Listeners 

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

</script>


<template>

<div class="relative w-full h-full">

  <div class="absolute controls w-full h-screen">
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

  <p class="opacity-50 p-card p-component p-2 absolute bottom-0 right-0 m-3 z-3" v-if="reader.chapter.images.length > 0">
    {{`${currentSlide(swiper?.activeIndex || 0)} / ${reader.chapter.images.length}`}}
  </p>

  <div>
    <!-- <p>Pepega</p>
    <p>{{reader.chapter.images}}</p> -->
    <Swiper
      @swiper="setSwiper"
      @active-index-change="handleSlideChange"
      :key="reader.chapter.path"
      :initialSlide="initialSlide"
      :slides-per-view="1"
      :space-between="12"
      :allow-touch-move="false"
      direction="vertical"
      :observer="true"      
      :speed="300"
      :v-show="!reader.loadingChapter"
    >
      <SwiperSlide v-for="image in reader.chapter.images">
        <div class="swiper-zoom-container">
          <Image class="w-full h-screen" :key="`${reader.chapter.path}/${image}`" :localImage="`${reader.chapter.path}/${image}`"/>
        </div>
      </SwiperSlide>
    </Swiper>

    <div class="absolute top-0 w-full h-screen flex align-items-center justify-content-center" v-if="reader.loadingChapter">
      <ProgressSpinner strokeWidth="4"/>
    </div>

  </div>
</div>

</template>


<style>

.swiper {
  height: 100vh;
}

</style>