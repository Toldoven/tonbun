<script setup lang="ts">

import SelectButton from 'primevue/selectbutton'
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const selectedDirecton = ref('horizontal')

const directions = [
    'horizontal',
    'vertical'
]

const selectedInvertDirections = ref(false)

const invertDirectons = [
    'false',
    'true'
]

const { t } = useI18n()

</script>



<template>

<div>
    <div class="menu-entry">
        <p class="mb-2">{{ t('reader.direction') }}</p>
        <SelectButton
            v-model="selectedDirecton"
            :options="directions"
            :optionLabel="(e) => t(`reader.directions.${e}`)"
        />
        <SelectButton
            v-model="selectedInvertDirections"
            :options="invertDirectons"
            :optionLabel="(e) => t(`reader.invertDirections.${e}`)"
            class="mt-2"
        />
    </div>
    <div class="menu-entry">
        <p class="mb-2">{{ t('reader.direction') }}</p>

    </div>
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