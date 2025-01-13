<script setup lang="ts">
import type { StyleContextMenuData } from '../features/StyleEditBlock.vue';
import StyleEditBlock from '../features/StyleEditBlock.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import type { ModuleClient } from '../../types';
import ThemeBlock from '../../components/features/ThemeBlock.vue';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};
type Emits = {
  (e: 'contextMenuOpen', v: StyleContextMenuData): void;
  (e: 'click', v: StyleContextMenuData): void;
  (e: 'inheritanceClick', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const client = props.client;
const theme = computed(() => client.getSelectedTheme()!);
const themePreviewStyles = computed(() => client.getSelectedStylesPreview(theme.value).value);
const themePreviewTargetStyles = computed(() => client.getSelectedStylesPreview(theme.value.target).value);
</script>

<template>
  <div class="TE-theme-styles-preview-block">
    <div class="TE-theme-styles-preview-block__card">
      <ThemeBlock
        :theme="{
          ...theme,
          id: client.getRuntimeSelectedId(),
        }"
      />
    </div>
    <DropDownBlock expand-enabled>
      <template #title>
        Preview card
      </template>
      <template #default>
        <div class="TE-theme-styles-preview-block__styles">
          <template
            v-for="styleKey of Object.keys(themePreviewStyles)"
            :key="`${client.getRuntimePreviewId()}.${styleKey}`"
          >
            <StyleEditBlock
              :id="`${client.getRuntimePreviewId()}.${styleKey}`"
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
