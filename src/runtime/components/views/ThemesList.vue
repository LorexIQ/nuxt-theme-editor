<script setup lang="ts">
import type { ModuleClient, ModuleThemeRootReturn } from '../../types';
import BlockThemes from '../widgets/BlockThemes.vue';
import ViewPage from '../widgets/ViewPage.vue';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const sandbox = props.client.getSandbox();

const selectedTheme = computed(() => props.client.getSelectedTheme());

function onDeleteTheme(theme: ModuleThemeRootReturn) {
  console.log(theme);
}
</script>

<template>
  <ViewPage
    class="TE-themes-list"
    page-id="index"
    :client="client"
  >
    <BlockThemes
      type="system"
      :is-open="selectedTheme ? selectedTheme.type === 'system' : true"
      :client="client"
      @context-menu-open="sandbox.openThemeContextMenu(...$event)"
    />
    <BlockThemes
      type="global"
      :is-open="selectedTheme?.type === 'global'"
      :client="client"
    />
    <BlockThemes
      type="local"
      :is-open="selectedTheme?.type === 'local'"
      :client="client"
      @context-menu-open="sandbox.openThemeContextMenu(...$event, { deleteTheme: onDeleteTheme })"
    />
  </ViewPage>
</template>
