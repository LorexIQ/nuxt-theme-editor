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
const theme = computed(() => client.getThemeById(themeId.value));

function onCancel() {
  router.push('index', 'tab-fade-rl');
}
async function onApprove() {
  if (!theme.value) return;

  if (!await theme.value.publish()) {
    throw new Error('.');
  }
}
async function onApproveSuccess() {
  router.push('index', 'tab-fade-rl');
}
</script>

<template>
  <QuestionPageBlock
    page="=publishApprove"
    class="TE-theme-publish"
    icon="Publish"
    question-title="Are you sure you want to make the theme global?"
    first-btn-title="Cancel"
    :first-on-click="onCancel"
    second-btn-title="Publish"
    second-btn-decor="success"
    :second-btn-loader="theme?.loader"
    :second-on-click="onApprove"
    :second-on-success="onApproveSuccess"
  />
</template>

<style lang="scss" scoped>
.TE-theme-publish {}
</style>
