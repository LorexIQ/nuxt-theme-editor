<script setup lang="ts">
import type { ModuleClient, ModuleTheme } from '../../types';
import BlockThemes from '../widgets/BlockThemes.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IsSwitch from '../shared/IsSwitch.vue';
import useLang from '../../helpers/useLang';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const sandbox = client.getSandbox();

function validateThemeAvailability(theme: ModuleTheme) {
  return !theme.loader.status;
}
function selectThemeAsMain([_, theme]: [MouseEvent, ModuleTheme]) {
  if (validateThemeAvailability(theme)) {
    client.setThemeSelectedAsMain(theme.id);
  }
}
function openThemeContextMenu([event, theme]: [MouseEvent, ModuleTheme]) {
  if (validateThemeAvailability(theme)) {
    sandbox.openThemeContextMenu(event, theme);
  }
}
</script>

<template>
  <ViewPage page="index">
    <div class="TE-themes-list">
      <BlockThemes
        type="system"
        :client="client"
        @double-click="selectThemeAsMain"
        @context-menu-open="openThemeContextMenu"
      >
        <template #preview>
          <slot name="preview" />
        </template>
      </BlockThemes>
      <BlockThemes
        v-if="client.getGlobalBlockEnabledStatus()"
        type="global"
        :client="client"
        :expand-action="() => client.loadGlobalThemes()"
        @double-click="selectThemeAsMain"
        @context-menu-open="openThemeContextMenu"
      >
        <template #preview>
          <slot name="preview" />
        </template>
      </BlockThemes>
      <BlockThemes
        v-if="client.getLocalBlockEnabledStatus()"
        type="local"
        :client="client"
        @double-click="selectThemeAsMain"
        @context-menu-open="openThemeContextMenu"
      >
        <template #preview>
          <slot name="preview" />
        </template>
      </BlockThemes>
    </div>
    <template #footer>
      <div class="TE-themes-list-footer">
        <IsSwitch
          :model-value="client.getAutoThemeModeStatus()"
          @check="client.setAutoThemeModeStatus(true)"
          @uncheck="client.setAutoThemeModeStatus(false)"
        />
        <p>{{ useLang('pageIndex.autoModeTitle') }}</p>
      </div>
    </template>
  </ViewPage>
</template>

<style lang="scss" scoped>
.TE-themes-list {
  &-footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;

    & p {
      color: var(--title);
    }
  }
}
</style>
