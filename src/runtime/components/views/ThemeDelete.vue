<script setup lang="ts">
import type { ModuleClient } from '../../types';
import QuestionPageBlock from '../shared/QuestionPageBlock.vue';
import useLang from '../../helpers/client/useLang';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const themeId = computed(() => router.route.query.themeId);
const theme = computed(() => client.getThemeById(themeId.value)!);

function onCancel() {
  router.push('index', 'tab-fade-rl');
}
async function onApprove() {
  if (!await theme.value.delete()) {
    throw new Error('.');
  }
}
async function onApproveSuccess() {
  router.push('index', 'tab-fade-rl');
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
    page="deleteTheme"
    class="TE-theme-delete"
    icon="Question"
    :question-title="useLang('pageDelete.title')"
    :first-btn-title="useLang('pageDelete.buttons.cancel')"
    :first-on-click="onCancel"
    :second-btn-title="useLang('pageDelete.buttons.delete')"
    :second-on-click="onApprove"
    :second-on-success="onApproveSuccess"
    :before-mount="onBeforeMount"
  />
</template>

<style lang="scss" scoped>
.TE-theme-delete {}
</style>
