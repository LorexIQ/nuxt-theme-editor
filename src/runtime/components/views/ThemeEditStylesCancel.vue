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
const cancelLink = computed(() => router.route.query.cancelLink ?? 'editThemeStyles');
const withBlockClose = computed(() => router.route.query.withBlockClose ?? false);

function onCancel() {
  router.push(`${cancelLink.value}?themeId=${themeId.value}`, 'tab-fade-rl');
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
    page="editThemeStylesCancel"
    class="TE-theme-edit-styles-cancel"
    icon="Warn"
    :question-title="useLang('pageEditStylesCancel.title')"
    :first-btn-title="useLang('pageEditStylesCancel.buttons.cancel')"
    :first-on-click="onCancel"
    :second-btn-title="useLang('pageEditStylesCancel.buttons.approve')"
    :second-on-click="onApprove"
  />
</template>

<style lang="scss" scoped>
.TE-theme-edit-styles-cancel {}
</style>
