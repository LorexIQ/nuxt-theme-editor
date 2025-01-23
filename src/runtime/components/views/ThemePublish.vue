<script setup lang="ts">
import type { ModuleClient } from '../../types';
import QuestionPageBlock from '../shared/QuestionPageBlock.vue';
import unwrap from '../../helpers/client/unwrap';
import useFetch from '../../helpers/client/useFetch';
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
  const themeUnwrap = theme.value;

  if (!themeUnwrap) return;

  try {
    await useFetch('POST', '/', {
      body: {
        id: themeUnwrap.id,
        name: themeUnwrap.name,
        description: themeUnwrap.description,
        previewJSON: JSON.stringify(unwrap.get(themeUnwrap.getStylesPreview())),
        stylesJSON: JSON.stringify(unwrap.get(themeUnwrap.getStyles()))
      }
    });

    client.deleteTheme(themeUnwrap.id);
    await client.loadGlobalThemes();
    router.push('index', 'tab-fade-rl');
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <QuestionPageBlock
    class="TE-theme-publish"
    icon="Publish"
    question-title="Are you sure you want to make the theme global?"
    first-btn-title="Cancel"
    second-btn-title="Publish"
    second-btn-decor="success"
    @click-first="onCancel"
    @click-second="onApprove"
  />
</template>

<style lang="scss" scoped>
.TE-theme-publish {}
</style>
