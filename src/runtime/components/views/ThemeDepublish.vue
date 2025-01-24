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
const theme = computed(() => client.getThemeById(themeId.value));

function onCancel() {
  router.push('index', 'tab-fade-rl');
}
async function onApprove() {
  if (!theme.value) return;

  try {
    await theme.value.depublish();
    router.push('index', 'tab-fade-rl');
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <QuestionPageBlock
    class="TE-theme-depublish"
    icon="Depublish"
    question-title="Are you serious about removing the topic from publication?"
    first-btn-title="Cancel"
    second-btn-title="Depublish"
    second-btn-decor="error"
    @click-first="onCancel"
    @click-second="onApprove"
  />
</template>

<style lang="scss" scoped>
.TE-theme-depublish {}
</style>
