<script setup lang="ts">
import type {
  ModuleDefineThemeBlockSettings,
  ModuleSandboxStyleContextMenuData,
  ModuleTheme,
  ModuleThemeEditMeta
} from '../../types';
import ThemeStylesBlockStyles from './ThemeStylesBlockStyles.vue';
import { computed } from '#imports';

type Props = {
  theme: ModuleTheme;
  styles: Record<string, any>[];
  rawStyles: Record<string, any>[];
  search: string;
  settings?: ModuleDefineThemeBlockSettings;
  id?: string;
  ctxPath?: string[];
};
type Emits = {
  (e: 'contextMenuOpen', v: ModuleSandboxStyleContextMenuData): void;
  (e: 'click', v: ModuleSandboxStyleContextMenuData): void;
  (e: 'inheritanceClick', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const stylesBlocks = computed<ModuleThemeEditMeta[]>(() => props.styles.map((stylesBlock, index) => ({
  id: stylesBlock.id,
  stylesBlock,
  rawStylesBlock: props.rawStyles[index],
  settings: stylesBlock.settings
})));
</script>

<template>
  <div class="TE-theme-styles-block">
    <template
      v-for="block of stylesBlocks"
      :key="block.id ?? 'self'"
    >
      <ThemeStylesBlock
        v-if="block.id"
        :id="block.id"
        :search="search"
        :theme="theme"
        :styles="block.stylesBlock.styles"
        :raw-styles="block.rawStylesBlock.styles"
        :settings="block.settings"
        :ctx-path="[...ctxPath ?? [], block.id]"
        @click="emit('click', $event)"
        @context-menu-open="emit('contextMenuOpen', $event)"
        @inheritance-click="emit('inheritanceClick', $event)"
      />
      <ThemeStylesBlockStyles
        v-else
        :id="id"
        :theme="theme"
        :block="block"
        :settings="settings"
        :ctxPath="ctxPath"
        :search="search"
        @click="emit('click', $event)"
        @context-menu-open="emit('contextMenuOpen', $event)"
        @inheritance-click="emit('inheritanceClick', $event)"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.TE-theme-styles-block {
  &__styles {
    border-bottom: 0;
  }
}
</style>
