<script setup lang="ts">

import { invoke } from "@tauri-apps/api/tauri";
import { useLibraryCardsStore } from "../../../stores/libraryCards";

import Button from "primevue/button";
import ProgressBar from 'primevue/progressbar'
import { computed, PropType, ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePrefsStore } from "../../../stores/prefs";
import { Cover, Manga, Relationship } from "@/types/mangaDex";

const props = defineProps({
    item: {
        type: Object as PropType<Manga>,
        required: true,
    },
});

const title = computed(() => {

    const defaultTitle = props.item.attributes.title.en

    if (prefs.value.lang === 'en') return defaultTitle

    const altTitles = props.item.attributes.altTitles

    const translated = altTitles.find((title: Object) => prefs.value.lang in title)

    if (translated) { return translated[prefs.value.lang] } else { return defaultTitle }
})

const libraryCards = useLibraryCardsStore();

const getCover = (manga: Manga) => {
    const filename = (manga.relationships.find(
        (item: Relationship) => item.type === "cover_art"
    ) as Cover).attributes.fileName;
    return (
        "https://uploads.mangadex.org/covers/" +
        manga.id +
        "/" +
        filename +
        ".256.jpg"
    );
};

const downloadManga = (manga: Manga) => {
    if (libraryCards.downloading[manga.id]) return
    libraryCards.startDownloading(manga.id)
    invoke("download_manga", {
        uuid: manga.id,
        lang: prefs.value.lang,
        title: title.value,
    });
};

const deleteLoading = ref(false)

const handleDelete = async (manga: Manga) => {
    try {
        deleteLoading.value = true
        await libraryCards.deleteMangaByUuid(manga.id)
    } catch(e) {
        console.log(e)
    } finally {
        deleteLoading.value = false
    }
}

const prefs = usePrefsStore()

const { t } = useI18n()

</script>

<template>
    <div class="p-card flex align-items-center">
        <div class="image">
            <img :src="getCover(item)" class="border-round" />
        </div>
        <div class="p-5 w-full">
            <h3>{{ title }}</h3>
            <div class="mt-3 w-full">
                <div v-if="!!libraryCards.downloading[item.id]">
                    <div v-if="libraryCards.downloading[item.id].outOf <= 0">
                        <ProgressBar mode="indeterminate"/>
                    </div>
                    <div v-else>
                        <ProgressBar mode="determinate" :value="(libraryCards.downloading[item.id].chapter / libraryCards.downloading[item.id].outOf)*100"/>
                        <p class="mt-2">
                            {{ libraryCards.downloading[item.id].chapter }}/{{
                                libraryCards.downloading[item.id].outOf
                            }}
                        </p>
                    </div>
                </div>
                <Button
                    v-else-if="!libraryCards.value.find((card) => card.uuid === item.id && card.connector === 'MangaDex')"
                    @click="downloadManga(item)"
                >
                    {{ t('download') }}
                </Button>
                <Button @click="handleDelete(item)" class="p-button-danger" :loading="deleteLoading" v-else>{{ t('delete') }}</Button>
            </div>
        </div>
    </div>
</template>
