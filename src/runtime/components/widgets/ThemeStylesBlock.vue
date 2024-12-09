<script setup lang="ts">
import StyleEditBlock from '../features/StyleEditBlock.vue';
import type { ModuleDefaultStyleKeys } from '../../types';
import { computed } from '#imports';

type Props = {
  styles: Record<string, any>[];
  rawStyles: Record<string, any>[];
  id?: string;
  ctxPath?: string[];
};
type Emits = {
  (e: 'contextMenuOpen', v: [MouseEvent, ModuleDefaultStyleKeys, string]): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const ctxPathComputed = computed(() => (props.ctxPath ?? []).join(' > '));
const styleCtxPathComputed = computed(() => (props.ctxPath ?? []).join('.'));
const stylesBlocks = computed(() => props.styles.map((stylesBlock, index) => ({
  id: stylesBlock.id,
  stylesBlock,
  rawStylesBlock: props.rawStyles[index]
})));
</script>

<template>
  <template
    v-for="block of stylesBlocks"
    :key="block.id ?? 'self'"
  >
    <ThemeStylesBlock
      v-if="block.id"
      :id="block.id"
      :styles="block.stylesBlock.styles"
      :raw-styles="block.rawStylesBlock.styles"
      :ctx-path="[...ctxPath ?? [], block.id]"
      @context-menu-open="emit('contextMenuOpen', $event)"
    />
    <div
      v-else
      class="TE-theme-styles-block"
    >
      <div class="TE-theme-styles-block__header">
        {{ ctxPathComputed }}
      </div>
      <div class="TE-theme-styles-block__styles">
        <template
          v-for="styleKey of Object.keys(block.stylesBlock)"
          :key="`${id}-${styleKey}`"
        >
          <!-- Перенести в компонент все превенты, хуенты, всё лишнее -->
          <StyleEditBlock
            :id="`${id}-${styleKey}`"
            :style-key="styleKey"
            :styles="block.stylesBlock"
            :raw-styles="block.rawStylesBlock"
            @contextmenu.prevent="emit('contextMenuOpen', [
              $event,
              `${styleCtxPathComputed}.${styleKey}` as any,
              block.rawStylesBlock[styleKey],
            ])"
          />
        </template>
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
.TE-theme-styles-block {
  &__header {
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border);
    color: var(--title);
    background-color: var(--bgBlockHeader);
  }
  &__styles {
  }
}
</style>
