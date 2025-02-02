<script setup lang="ts">
import type { ModuleClient } from '../../types';
import BlockThemes from '../widgets/BlockThemes.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IsSwitch from '../shared/IsSwitch.vue';
import ClientErrors from '../features/ClientErrors.vue';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const sandbox = props.client.getSandbox();
</script>

<template>
  <ViewPage>
    <div class="TE-themes-list">
      <BlockThemes
        type="system"
        :client="client"
        @context-menu-open="sandbox.openThemeContextMenu(...$event)"
      >
        <template #preview>
          <slot name="preview" />
        </template>
      </BlockThemes>
      <BlockThemes
        type="global"
        :client="client"
        :expand-action="() => client.loadGlobalThemes()"
        @context-menu-open="sandbox.openThemeContextMenu(...$event)"
      >
        <template #preview>
          <slot name="preview" />
        </template>
      </BlockThemes>
      <BlockThemes
        type="local"
        :client="client"
        @context-menu-open="sandbox.openThemeContextMenu(...$event)"
      >
        <template #preview>
          <slot name="preview" />
        </template>
      </BlockThemes>
    </div>
    <template #messages>
      <ClientErrors
        :client="client"
        page="index"
      />
    </template>
    <template #footer>
      <div class="TE-themes-list-footer">
        <IsSwitch
          :model-value="client.getAutoThemeModeStatus()"
          @check="client.setAutoThemeModeStatus(true)"
          @uncheck="client.setAutoThemeModeStatus(false)"
        />
        <p>Use the color scheme of the device</p>
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
