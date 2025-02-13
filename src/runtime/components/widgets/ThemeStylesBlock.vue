<script setup lang="ts">
import StyleEditBlock from '../features/StyleEditBlock.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import type { ModuleDefineThemeBlockSettings, ModuleSandboxStyleContextMenuData, ModuleTheme } from '../../types';
import { computed } from '#imports';

type Props = {
  theme: ModuleTheme;
  styles: Record<string, any>[];
  rawStyles: Record<string, any>[];
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

const ctxPathComputed = computed(() => (props.ctxPath ?? []).join(' > '));
const styleCtxPathComputed = computed(() => (props.ctxPath ?? []).join('.'));
const stylesBlocks = computed(() => props.styles.map((stylesBlock, index) => ({
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
        :theme="theme"
        :styles="block.stylesBlock.styles"
        :raw-styles="block.rawStylesBlock.styles"
        :settings="block.settings"
        :ctx-path="[...ctxPath ?? [], block.id]"
        @click="emit('click', $event)"
        @context-menu-open="emit('contextMenuOpen', $event)"
        @inheritance-click="emit('inheritanceClick', $event)"
      />
      <DropDownBlock v-else>
        <template #title>
          {{ settings?.name || ctxPathComputed }}
        </template>
        <template #default>
          <div class="TE-theme-styles-block__styles">
            <template
              v-for="styleKey of Object.keys(block.stylesBlock)"
              :key="`${id}.${styleKey}`"
            >
              <StyleEditBlock
                :id="`${styleCtxPathComputed}.${styleKey}`"
                :style-key="styleKey"
                :theme="theme"
                :styles="block.stylesBlock"
                :raw-styles="block.rawStylesBlock"
                @click="emit('click', $event)"
                @context-menu-open="emit('contextMenuOpen', $event)"
                @inheritance-click="emit('inheritanceClick', $event)"
              />
            </template>
          </div>
        </template>
      </DropDownBlock>
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
