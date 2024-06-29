<script setup lang="ts">

import { useReaderStore } from '@/stores/reader';
import SelectButton from 'primevue/selectbutton'
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReaderSettingsStore } from '../../stores/readerSettings';

const settings = useReaderSettingsStore()

const reader = useReaderStore()

watch(reader, () => {
    settings.format = reader.manga.meta.format
}, { immediate: true })

const updateFormat = (e) => {
    settings.updateFormat(e.value)
}

const { t } = useI18n()

</script>



<template>

<div>
    <div class="menu-entry">
        <p class="mb-2">{{ t('reader.type') }}</p>
        <SelectButton
            v-model="settings.format"
            :options="settings.formats"
            @change="updateFormat"
            :optionLabel="(e) => t(`reader.types.${e}`)"
        />
    </div>
    <!-- <div class="menu-entry">
        <p class="mb-2">{{ t('reader.direction') }}</p>
        <SelectButton
            v-model="selectedDirecton"
            :options="directions"
            :optionLabel="(e) => t(`reader.directions.${e}`)"
        />        <SelectButton
            v-model="selectedInvertDirections"
            :options="invertDirectons"
            :optionLabel="(e) => t(`reader.invertDirections.${e}`)"
            class="mt-2"
        />
    </div>
    <div class="menu-entry">
        <p class="mb-2">{{ t('reader.direction') }}</p>
    </div> -->
    <!-- <div class="menu-entry">
        <p class="mb-2">{{ t('reader.direction') }}</p>
        <SelectButton
            v-model="selectedInvertDirections"
            :options="invertDirectons"
            :optionLabel="(e) => t(`reader.invertDirections.${e}`)"
        />
    </div> -->
</div>

</template>


<style lang="scss">

.menu-entry + .menu-entry {
    margin-top: 1.5rem;
}

</style>