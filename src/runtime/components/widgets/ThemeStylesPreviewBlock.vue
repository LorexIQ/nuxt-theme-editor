<script setup lang="ts">
import type { StyleContextMenuData } from '../features/StyleEditBlock.vue';
import StyleEditBlock from '../features/StyleEditBlock.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import type { ModuleTheme } from '../../types';
import ThemeBlock from '../../components/features/ThemeBlock.vue';
import unwrap from '../../helpers/client/unwrap';
import { computed } from '#imports';

type Props = {
  theme: ModuleTheme;
};
type Emits = {
  (e: 'contextMenuOpen', v: StyleContextMenuData): void;
  (e: 'click', v: StyleContextMenuData): void;
  (e: 'inheritanceClick', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const theme = computed(() => props.theme);
const themePreviewStyles = computed(() => unwrap.get(theme.value.getPrepareStylesPreview()));
const themePreviewTargetStyles = computed(() => unwrap.get(theme.value.getStylesPreview('edited')));
</script>

<template>
  <div class="TE-theme-styles-preview-block">
    <div class="TE-theme-styles-preview-block__card">
      <ThemeBlock :theme="theme">
        <template #preview>
          <slot name="preview" />
        </template>
      </ThemeBlock>
    </div>
    <DropDownBlock expand-enabled>
      <template #title>
        Preview card
      </template>
      <template #default>
        <div class="TE-theme-styles-preview-block__styles">
          <template
            v-for="styleKey of Object.keys(themePreviewStyles)"
            :key="`${theme.runtimePreviewId}.${styleKey}`"
          >
            <StyleEditBlock
              :id="`${theme.runtimePreviewId}.${styleKey}`"
              :theme="theme"
              :style-key="styleKey"
              :styles="themePreviewStyles"
              :raw-styles="themePreviewTargetStyles"
              @click="emit('click', $event)"
              @context-menu-open="emit('contextMenuOpen', $event)"
              @inheritance-click="emit('inheritanceClick', $event)"
            />
          </template>
        </div>
      </template>
    </DropDownBlock>
  </div>
</template>

<style scoped lang="scss">
.TE-theme-styles-preview-block {
  &__card {
    padding: 10px;
    border-bottom: 1px solid var(--border);

    & .TE-theme-block {
      cursor: default;
    }
  }
  &__styles {
    border-bottom: 0;
  }
}
</style>
