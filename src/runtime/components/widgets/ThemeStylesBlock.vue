<script setup lang="ts">
import StyleEditBlock from '../features/StyleEditBlock.vue';
import { computed } from '#imports';

type Props = {
  styles: Record<string, any>[];
  rawStyles: Record<string, any>[];
  id?: string;
};

const props = defineProps<Props>();
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
    />
    <div
      v-else
      class="TE-theme-styles-block"
    >
      <div class="TE-theme-styles-block__header">
        {{ id }}
      </div>
      <div class="TE-theme-styles-block__styles">
        <StyleEditBlock
          v-for="styleKey of Object.keys(block.stylesBlock)"
          :id="`${id}-${styleKey}`"
          :key="`${id}-${styleKey}`"
          :style-key="styleKey"
          :styles="block.stylesBlock"
          :raw-styles="block.rawStylesBlock"
        />
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
