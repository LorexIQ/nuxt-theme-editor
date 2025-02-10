<script setup lang="ts">
import type { ModuleClient } from '../../types';
import QuestionPageBlock from '../shared/QuestionPageBlock.vue';
import useLang from '../../helpers/useLang';
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

  if (!await theme.value.depublish()) {
    throw new Error('.');
  }
}
async function onApproveSuccess() {
  router.push('index', 'tab-fade-rl');
}
</script>

<template>
  <QuestionPageBlock
    page="depublishApprove"
    class="TE-theme-depublish"
    icon="Depublish"
    :question-title="useLang('pageDepublish.title')"
    :first-btn-title="useLang('pageDepublish.buttons.cancel')"
    :first-on-click="onCancel"
    :second-btn-title="useLang('pageDepublish.buttons.depublish')"
    second-btn-decor="error"
    :second-on-click="onApprove"
    :second-on-success="onApproveSuccess"
  />
</template>

<style lang="scss" scoped>
.TE-theme-depublish {}
</style>
