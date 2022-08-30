<script setup lang="ts">

import SwiperC from './SwiperC.vue'
import Longstrip from './Longstrip.vue';
import { useReaderSettingsStore } from '../../stores/readerSettings';
import { useMetaStore } from '../../stores/meta';
import { usePrefsStore } from '../../stores/prefs';
import { computed } from 'vue';

const settings = useReaderSettingsStore()
const meta = useMetaStore()
const prefs = usePrefsStore()

const defaultFormat = computed(() => prefs.value?.reader?.default_format )

const metaFormat = computed(() => meta.value?.format )

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