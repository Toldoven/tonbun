<script setup lang="ts">

import Dialog from 'primevue/dialog'
import SelectButton from 'primevue/selectbutton'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import { open } from '@tauri-apps/api/dialog'


// import Button from 'primevue/button'
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePrefsStore } from '../../stores/prefs';
import { useSettingsModalStore } from '../../stores/settingsModal';
import { useLibraryCardsStore } from '../../stores/libraryCards'
import { invoke } from '@tauri-apps/api/tauri'

const settingsModal = useSettingsModalStore()
const prefs = usePrefsStore()
const libraryCards = useLibraryCardsStore()

const selectedLanguage = ref<String>('en')
const discordRichPresence = ref(false)
const selectedReaderFormat = ref('Slides')

const languages = [
    {name: 'English', code: 'en'},
    {name: 'Русский', code: 'ru'},
]

const readerFormats = [
    'Slides',
    'Longstrip',
]

const handleDirectorySelect = async () => {
    try {
       const dir = await open({ directory: true })
        if (!dir) return
        await invoke('update_manga_dir', { dir })
        await prefs.loadPrefs()
        await libraryCards.update()
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => {
    selectedLanguage.value = prefs.value.lang
    discordRichPresence.value = prefs.value.discord_rich_presence_enabled
    selectedReaderFormat.value = prefs.value.reader.default_format
})

watch(selectedLanguage, (value: string) => prefs.setLang(value))
watch(discordRichPresence, (value: boolean) => prefs.setDiscordRichPresence(value))
watch(selectedReaderFormat, (value) => prefs.setReaderFormat(value))

const { t } = useI18n()

</script>


<template>

<Dialog :header="t('settings.settings')" v-model:visible="settingsModal.value" :modal="true" :draggable="false" style="width: 512px">
    <div class="setting-entry">
        <p class="mb-2">{{ t('settings.language') }}</p>
        <SelectButton v-model="selectedLanguage" :options="languages" option-label="name" option-value="code"/>
    </div>
    <div class="setting-entry">
        <p class="mb-2">{{ t('settings.folder') }}</p>
        <div class="flex gap-2">
            <InputText :value="prefs.value.manga_directory" class="flex-grow-1 fake-disabled" disabled="true"></InputText>
            <Button @click="handleDirectorySelect">{{ t('settings.select') }}</Button>
        </div>
    </div>
    <div class="setting-entry">
        <p class="mb-2">{{ t('settings.readerFormat') }}</p>
        <SelectButton v-model="selectedReaderFormat" :options="readerFormats" />
    </div>
    <div class="setting-entry">
        <p class="mb-2">{{ t('settings.discordRichPresence') }}</p>
        <!-- <Button @click="invoke('discord_connect')">Connect</Button>
        <Button @click="invoke('discord_close')">Disconnect</Button> -->
        <InputSwitch v-model="discordRichPresence" />
    </div>
</Dialog>

</template>


<style lang="scss">

.fake-disabled {
    opacity: 1 !important;
}

.setting-entry + .setting-entry {
    margin-top: 1.5rem;
}

</style>