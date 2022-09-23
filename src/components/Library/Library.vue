<script setup lang="ts">

import Grid from './Grid.vue'
import InputText from 'primevue/inputtext'
import { ref, watch } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { useLibraryCardsStore } from '../../stores/libraryCards';
import Results from './Results.vue';
import Button from 'primevue/button'

import Edit from './Edit.vue'
import Settings from './Settings.vue'
import { useI18n } from 'vue-i18n';
import { usePrefsStore } from '../../stores/prefs';
import { useSettingsModalStore } from '../../stores/settingsModal';
import { Manga } from '@/types/mangaDex';

// const searchInput = ref('');
const search = ref('')
const searching = ref(false)
const lastInput = ref(Date.now())

const result = ref<Array<Manga>>([])
const error = ref<boolean>(false)

const handleSearchInput = (e: Event) => {
  handleSearch(
    (e.target as HTMLInputElement).value
  )
}

const handleSearch = (value: string) => {

  search.value = value

  searching.value = true

  const whenRun = Date.now()
  lastInput.value = whenRun

  if (!value) {
    searching.value = false
    return
  }

  setTimeout(async () => {
    if (lastInput.value != whenRun) return
    await doSearch()
    searching.value = false
    search.value = value
  }, 550)

}

const prefs = usePrefsStore()

const doSearch = async () => {
  try {
    result.value = await invoke<Array<Manga>>('search_title', { query: search.value, lang: prefs.value.lang })
  } catch (e) {
    error.value = true
  }
}

const settingsModal = useSettingsModalStore()

const { t } = useI18n()

</script>


<template>
  <main class="h-full p-3 relative">

      <Button @click="settingsModal.value = true" icon="pi pi-cog" class="p-button-rounded fixed bottom-0 right-0 m-4 z-3"></Button>

    <Edit/>
    <Settings/>

    <span class="w-full mb-3 p-input-icon-left p-input-icon-right">
      <i class="pi pi-search" />
      <InputText class="w-full" type="text" :placeholder="t('search')" :value="search" @input="(e: Event) => handleSearchInput(e)"></InputText>
      <i v-if="search" class="pi pi-times" @click="() => handleSearch('')"/>
    </span>

    <Results :result="result" :error="error" :searching="searching" v-if="search"/>
    <Grid v-else/>

  </main>
</template>

<style lang="scss">

.resultGrid {
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(460px, 1fr) );
  gap: 1rem;

  .p-card {
    height: 200px;
  }

  .image {
    aspect-ratio: 2/3;
    height: 100%;
  }

  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
}

.pi-cog {
  font-size: 1.5rem !important;
}

.pi-times {
  cursor: pointer;
}

.pi-search {
  width: fit-content;
  pointer-events: none;
  -webkit-pointer-events: none;
  -moz-pointer-events: none;
  -ms-pointer-events: none;
}

</style>