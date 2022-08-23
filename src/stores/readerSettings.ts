import { defineStore } from "pinia";
import { ref } from "vue";

export const useReaderSettingsStore = defineStore('readerSettings', () => {

    const type = ref('slides')

    const types = [
        'slides',
        'long_strip'
    ]

    return { type, types }

})