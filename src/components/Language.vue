<script setup lang="ts">

import Button from 'primevue/button'

const emit = defineEmits(['setLang'])

</script>


<template>

<!-- <h3>Choose language / Выберите язык</h3> -->

<div class="flex w-full h-full align-items-center justify-content-center flex-column p-5">
    <h2 class="mb-5 text-center">Choose language / Выберите язык</h2>
    <div class="language__grid w-full">
        <div class="flex flex-column p-6 p-card p-component">
            <!-- <img width="96" src="english.svg"/> -->
            <h3 class="mb-2 line-height-3">English</h3>
            <p class="line-height-3">Language will affect UI as well as the language of manga you download</p>
            <Button label="Select" @click="emit('setLang', 'en')" class="mt-4"></Button>
        </div>
        <div class="flex flex-column p-6 p-card p-component">
            <!-- <img width="96" src="russian.svg"/> -->
            <h3 class="mb-2 line-height-3">Русский</h3>
            <p class="line-height-3">Язык повлияет на интерфейс и на язык скачиваемой манги</p>
            <Button label="Выбрать" @click="emit('setLang', 'ru')" class="mt-4"></Button>
        </div>
    </div>
</div>

</template>


<style lang="scss">

.language__grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
    max-width: 900px;
    @media (max-width: 799px) {
        grid-template-columns: 1fr;
    }
}

</style>