<script setup lang="ts">

import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import { WebviewWindow, appWindow, getCurrent } from '@tauri-apps/api/window'

import { onMounted, ref } from 'vue'

import { invoke, convertFileSrc } from '@tauri-apps/api/tauri'
import { useLibraryCardsStore } from '../../../stores/libraryCards'
import { useEditModalStore } from '../../../stores/editModal'
import { useI18n } from 'vue-i18n'
import { usePrefsStore } from '../../../stores/prefs'
import { event } from '@tauri-apps/api'
import { message } from '@tauri-apps/api/dialog'
import { MangaMeta } from '@rs-ts/MangaMeta'

const libraryCards = useLibraryCardsStore();
const editModal = useEditModalStore();
const prefs = usePrefsStore();

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  localCover: {
    type: String,
    required: true,
  },
  drag: Boolean,
})

const cover = convertFileSrc(props.localCover)


const handleRead = async () => {
  try {

    libraryCards.loading = true
    // setTimeout(() => loading.value = false, 500)
    event.once("manga_loaded", () => libraryCards.loading = false)

    // await new Promise(r => setTimeout(r, 2000));

    const meta = await invoke<MangaMeta>('get_manga_meta_by_title', { title: props.title })
    const url = `/read/${props.title}/${meta.chapter}/${meta.slide}`

    let webview = WebviewWindow.getByLabel('reader')

    if (webview) {
      await webview.emit('change_reader_url_test', url)
    } else {
      webview = new WebviewWindow('reader', {
        url,
        visible: false,
        title: props.title,
      } )
    }

  } catch (e) {
    console.error(e)
    libraryCards.loading = false
    await message(`Error when trying to open manga: ${e}`);
  }
}

const handleEdit = async () => {
  editModal.value = true
  editModal.manga = {
    uuid: props.uuid,
    title: props.title,
  }
}

const { t } = useI18n()

</script>


<template>
  <div v-if="cover" class="library-card">
    <div v-if="!drag" class="library-card__hover text-center flex flex-column align-items-center justify-content-center p-4">
      <h4>{{ title }}</h4>
      <p class="mt-2" v-if="libraryCards.downloading[uuid]">Downloading {{libraryCards.downloading[uuid].chapter}}/{{libraryCards.downloading[uuid].outOf}}</p>
      <div class="mt-3 flex gap-2">
        <Button :loading="libraryCards.loading" :label="t('read')" @click="handleRead"></Button>
        <Button @click="handleEdit" icon="pi pi-pencil" class="p-button-rounded p-button-text"/>
      </div>
    </div>
    <img class="library-card__content" :src="cover" :alt="title"/>
  </div>
  <div v-else class="library-card">
    <Skeleton class="library-card__content"/>
  </div>
</template>


<style lang="scss">

@import 'primeflex/primeflex.scss';

.pi-pencil {
  font-size: 1.5rem !important;
}

.library-card {
  @include styleclass('relative p-card p-component');
  aspect-ratio: 2/3;
  -webkit-user-select: none;
  user-select: none;

  img {
    object-fit: cover;
  }

  img, p, h4 {
    -webkit-user-select: none;
    user-select: none;
  }

  &:hover {
    .library-card__hover {
      display: block;
    }
  }

}

.library-card__content {
  @include styleclass('absolute w-full h-full border-round');
}

.library-card__hover {

  @include styleclass('absolute w-full h-full border-round z-1');
  opacity: 0;
  transition: background .15s ease;

  &:hover {
    background: rgba(0,0,0,0.5);
    opacity: 1;
  }
}

.drag {
  .library-card {
    .library-card__hover {
      opacity: 0;
      display: none
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0;
}

.sortable-chosen {
  .library-card {
    opacity: 0.9;
    .library-card__hover {
      opacity: 0;
      display: none
    }
  }
}

</style>