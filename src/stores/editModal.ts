import { defineStore } from "pinia"
import { ref } from "vue"

export const useEditModalStore = defineStore('editModal', () => {
    const value = ref(false)
    const manga = ref({
        uuid: '',
        title: '',
    })
    return { value, manga }
})