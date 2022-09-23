<script setup lang="ts">

import Skeleton from 'primevue/skeleton'
import Card from './Results/Card.vue'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import { PropType } from 'vue';
import { Manga, MangaSearchResponse } from '@/types/mangaDex';

const props = defineProps({
    result: Object as PropType<Array<Manga>>,
    error: Boolean,
    searching: Boolean,
})

const { t } = useI18n()

</script>

<template>
    <div>
        <div v-if="searching" class="resultGrid mb-3">
            <div v-for="_ in 20" class="p-card flex align-items-center">
                <div class="image">
                    <Skeleton size="100%" />
                </div>
                <div class="p-5">
                    <Skeleton width="12rem" />
                    <Skeleton class="mt-3" height="42px" width="103px" />
                </div>
            </div>
        </div>
        <Message v-else-if="error" severity="error" :closable="false">{{ t('error.cantConnect') }}</Message>
        <div v-else-if="result.length > 0" class="resultGrid">
            <Card v-for="item in result" :item="item"/>
        </div>
        <Message v-else severity="error" :closable="false">{{ t('error.notFound') }}</Message>
    </div>
</template>

<style>

.p-message {
    margin: 0 !important;
}

.p-message-leave-active, .p-message-enter-active {
	transition: none !important;
}

</style>
