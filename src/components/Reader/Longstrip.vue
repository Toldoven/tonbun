<script setup lang="ts">

import { useReaderStore } from '../../stores/reader'

import Image from './Image.vue'

const reader = useReaderStore()

</script>

<template>

<div class="longstip">
    <Image v-for="image in reader.chapterData.images" :key="`${reader.chapterData.path}/${image}`" :localImage="`${reader.chapterData.path}/${image}`"/>
</div>


</template>

<style lang="scss">

.longstip {
    display: block;
    img {
        display: block;
        margin: auto;
        max-width: 100%;
    }
}

</style>