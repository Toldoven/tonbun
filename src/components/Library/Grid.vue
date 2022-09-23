<script setup lang="ts">

import { ref, watch, computed } from 'vue'

import Card from './Grid/Card.vue'
import Draggable from 'vuedraggable'
import { useLibraryCardsStore } from '@/stores/libraryCards'
import { useI18n } from 'vue-i18n'

const libraryCards = useLibraryCardsStore()
const drag = ref(false)

watch(drag, value => libraryCards.value.push())

const dragOptions = computed(() => {
  return {
    animation: 400,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  }
})

const { t } = useI18n()

</script>


<template>
  <div v-if="libraryCards.value.length > 0">
    <Draggable
      :class="`w-full library-grid ${drag && 'drag'}`"
      :component-data="{
        tag: 'div',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null
      }"
      v-model="libraryCards.value"
      v-bind="dragOptions"
      @start="drag=true" 
      @end="drag=false" 
      item-key="uuid"
      >
      <template #item="{element}">
        <div>
          <Card :localCover="element.cover" :title="element.title" :key="element.uuid" :chapter="element.chapter" :slide="element.slide" :uuid="element.uuid" :drag="drag"/>
        </div>
      </template>
    </Draggable>
  </div>
  <div class="flex p-4 flex-column align-items-center" v-else>
    <h3>{{ t('noManga.h')}}</h3>
    <p class="mt-3">{{ t('noManga.p')}}</p>
  </div>
</template>

<style>

.library-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat( auto-fill, minmax(220px, 1fr) );
}

</style>