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

function onCancel() {
  router.push(`editThemeStyles?themeId=${themeId.value}`, 'tab-fade-rl');
}
function onApprove() {
  client.setEditedTheme();
  router.push('index', 'tab-fade-rl');
}
</script>

<template>
  <QuestionPageBlock
    class="TE-theme-edit-styles-cancel"
    icon="Warn"
    question-title="The changes you have made may not be saved"
    first-btn-title="Cancel"
    second-btn-title="Approve"
    @click-first="onCancel"
    @click-second="onApprove"
  />
</template>

<style lang="scss" scoped>
.TE-theme-edit-styles-cancel {}
</style>
