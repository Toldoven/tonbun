<script setup lang="ts">

import SwiperC from './SwiperC.vue'
import Longstrip from './Longstrip.vue';
import { usePrefsStore } from '../../stores/prefs';
import { computed } from 'vue';
import { useReaderStore } from '@/stores/reader';

const prefs = usePrefsStore()
const reader = useReaderStore()

const defaultFormat = computed(() => prefs.value?.reader?.default_format )

const metaFormat = computed(() => reader.manga?.meta?.format )

</script>


<template>

<template v-if="metaFormat === 'Default'">
    <SwiperC v-if="defaultFormat === 'Slides'"/>
    <Longstrip v-if="defaultFormat === 'Longstrip'"/>
</template>
<template v-else>
    <SwiperC v-if="metaFormat === 'Slides'"/>
    <Longstrip v-if="metaFormat === 'Longstrip'"/>
</template>

</template>