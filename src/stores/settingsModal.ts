import { defineStore } from "pinia"
import { ref } from "vue"

export const useSettingsModalStore = defineStore('settingsModal', () => {
    const value = ref(false)
    return { value }
})