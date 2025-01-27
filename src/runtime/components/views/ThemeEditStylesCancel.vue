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
const themeId = computed(() => router.route.query.themeId);
const withBlockClose = computed(() => router.route.query.withBlockClose ?? false);

function onCancel() {
  router.push(`editThemeStyles?themeId=${themeId.value}`, 'tab-fade-rl');
}
function onApprove() {
  client.setThemeSelectedAsEdited(undefined);

  if (withBlockClose.value) {
    client.setBlockStatus(false);
  }

  router.push('index', 'tab-fade-rl');
}
</script>

<template>
  <QuestionPageBlock
    class="TE-theme-edit-styles-cancel"
    icon="Warn"
    question-title="The changes you have made may not be saved"
    first-btn-title="Cancel"
    :first-on-click="onCancel"
    second-btn-title="Approve"
    :second-on-click="onApprove"
  />
</template>

<style lang="scss" scoped>
.TE-theme-edit-styles-cancel {}
</style>
