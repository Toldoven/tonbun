<script setup lang="ts">

import SwiperC from './SwiperC.vue'
import Longstrip from './Longstrip.vue';
import { useReaderSettingsStore } from '../../stores/readerSettings';

const settings = useReaderSettingsStore()

</script>


<template>

<SwiperC v-if="settings.type === 'slides'"/>
<Longstrip v-else-if="settings.type === 'long_strip'" />

</template>