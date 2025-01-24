<script setup lang="ts">
import type { ModuleClient } from '../../types';
import QuestionPageBlock from '../shared/QuestionPageBlock.vue';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const themeId = computed(() => router.getQuery().themeId);
const theme = computed(() => client.getThemeById(themeId.value)!);

async function onThemeDelete() {
  if (await theme.value.delete()) {
    router.push('index', 'tab-fade-rl');
  }
}

function onBeforeMount() {
  if (!themeId.value || !theme.value) {
    router.push('index', 'tab-fade-lr');
    return;
  }
}
</script>

<template>
  <QuestionPageBlock
    class="TE-theme-delete"
    icon="Question"
    question-title="Are you sure you want to delete the theme"
    first-btn-title="Cancel"
    second-btn-title="Delete"
    :before-mount="onBeforeMount"
    @click-first="router.push('index', 'tab-fade-rl')"
    @click-second="onThemeDelete"
  />
</template>

<style lang="scss" scoped>
.TE-theme-delete {}
</style>
