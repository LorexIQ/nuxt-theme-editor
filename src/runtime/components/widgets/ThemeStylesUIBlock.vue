<script setup lang="ts">
import StyleEditBlock from '../features/StyleEditBlock.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import type { ModuleSandboxStyleContextMenuData, ModuleTheme } from '../../types';
import unwrap from '../../helpers/client/unwrap';
import useLang from '../../helpers/client/useLang';
import { computed } from '#imports';

type Props = {
  theme: ModuleTheme;
};
type Emits = {
  (e: 'contextMenuOpen', v: ModuleSandboxStyleContextMenuData): void;
  (e: 'click', v: ModuleSandboxStyleContextMenuData): void;
  (e: 'inheritanceClick', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const theme = computed(() => props.theme);
const themeUIStyles = computed(() => unwrap.get(theme.value.getPrepareStylesUI()));
const themeUITargetStyles = computed(() => unwrap.get(theme.value.getStylesUI('edited')));
</script>

<template>
  <DropDownBlock
    class="TE-theme-styles-ui-block"
    expand-enabled
  >
    <template #title>
      {{ useLang('pageEditThemeStyles.uiHeader') }}
    </template>
    <template #default>
      <div class="TE-theme-styles-ui-block__styles">
        <template
          v-for="styleKey of Object.keys(themeUIStyles)"
          :key="`${theme.runtimePreviewId}.${styleKey}`"
        >
          <StyleEditBlock
            :id="`${theme.runtimePreviewId}.${styleKey}`"
            :theme="theme"
            :style-key="styleKey"
            :styles="themeUIStyles"
            :raw-styles="themeUITargetStyles"
            @click="emit('click', $event)"
            @context-menu-open="emit('contextMenuOpen', $event)"
            @inheritance-click="emit('inheritanceClick', $event)"
          />
        </template>
      </div>
    </template>
  </DropDownBlock>
</template>

<style scoped lang="scss">
.TE-theme-styles-ui-block {
  &__styles {
    border-bottom: 0;
  }
}
</style>
