<script setup lang="ts">

import Dialog from 'primevue/dialog'
import SelectButton from 'primevue/selectbutton'


// import Button from 'primevue/button'
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePrefsStore } from '../../stores/prefs';
import { useSettingsModalStore } from '../../stores/settingsModal';

const settingsModal = useSettingsModalStore()
const prefs = usePrefsStore()

const selectedLanguage = ref<String>('en')

const languages = [
    {name: 'English', code: 'en'},
    {name: 'Русский', code: 'ru'},
]

onMounted(() => {
    console.log()
    selectedLanguage.value = prefs.value.lang
})

watch(selectedLanguage, (value: string) => {
    prefs.setLang(value)
})

const { t } = useI18n()

</script>


<template>

<Dialog :header="t('settings')" v-model:visible="settingsModal.value" :modal="true" :draggable="false" style="width: 512px">
    <p class="mb-2">{{ t('language') }}</p>
    <SelectButton v-model="selectedLanguage" :options="languages" option-label="name" option-value="code"/>
</Dialog>

</template>