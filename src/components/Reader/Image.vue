<script setup lang="ts">

import { convertFileSrc } from '@tauri-apps/api/tauri';

const props = defineProps({
  localImage: {
    type: String,
    required: true
  }
})

const image = convertFileSrc(props.localImage)

</script>


<template>

<img v-show="image" :src="image"/>

</template>


<style scoped>

img {
  object-fit: contain;
}

</style>