<script setup lang="ts">
import type { ModuleClient } from '../../types';
import BlockThemes from '../widgets/BlockThemes.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IsSwitch from '../shared/IsSwitch.vue';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const sandbox = props.client.getSandbox();

const selectedTheme = computed(() => props.client.getSelectedTheme());
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
      @context-menu-open="sandbox.openThemeContextMenu(...$event)"
    />
    <template #footer>
      <div class="TE-themes-list-footer">
        <IsSwitch
          :model-value="client.getAutoThemeModeStatus()"
          @check="client.setAutoThemeModeStatus(true)"
          @uncheck="client.setAutoThemeModeStatus(false)"
        />
      </div>
    </template>
  </ViewPage>
</template>
