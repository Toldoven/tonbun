<script setup lang="ts">

import Dialog from 'primevue/dialog'
import { useLibraryCardsStore } from '../../stores/libraryCards';
import { useEditModalStore } from '../../stores/editModal';

import Button from 'primevue/button'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const libraryCards = useLibraryCardsStore();
const editModal = useEditModalStore();

const deleteLoading = ref(false)

const handleDelete = async () => {
    try {
        deleteLoading.value = true
        await libraryCards.deleteMangaByUuid(editModal.manga.uuid)
        editModal.value = false
    } catch(e) {
        console.error(e)
    } finally {
        deleteLoading.value = false
    }
}

const { t } = useI18n()

</script>


<template>

<Dialog :header="editModal.manga.title" v-model:visible="editModal.value" :modal="true" :draggable="false" style="width: 512px">
	<Button
        @click="handleDelete"
        :loading="deleteLoading"
        :disabled="!!libraryCards.downloading[editModal.manga.uuid]"
        class="p-button-danger"
    >
        {{ t('delete') }}
    </Button>
</Dialog>

</template>