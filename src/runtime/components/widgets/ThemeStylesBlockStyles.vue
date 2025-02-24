<script setup lang="ts">
import StyleEditBlock from '../features/StyleEditBlock.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import type {
  ModuleDefineThemeBlockSettings,
  ModuleSandboxStyleContextMenuData, ModuleTheme,
  ModuleThemeEditMeta
} from '../../types';
import { computed } from '#imports';

type Props = {
  theme: ModuleTheme;
  block: ModuleThemeEditMeta;
  id?: string;
  settings?: ModuleDefineThemeBlockSettings;
  ctxPath?: string[];
  search?: string;
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
const blockName = computed(() => props.settings?.name || ctxPathComputed.value);
const stylesKeys = computed(() => Object.keys(props.block.stylesBlock));
const filteredStylesKeys = computed(() => stylesKeys.value.filter(styleKey => styleKey.toLowerCase().includes((props.search ?? '').toLowerCase())));
const isBlockVisible = computed(() => stylesKeys.value && blockName.value.toLowerCase().includes((props.search ?? '').toLowerCase()));
</script>

<template>
  <DropDownBlock v-if="isBlockVisible || filteredStylesKeys.length">
    <template #title>
      {{ blockName }}
    </template>
    <template #default>
      <div class="TE-theme-styles-block__styles">
        <template
          v-for="styleKey of isBlockVisible ? stylesKeys : filteredStylesKeys"
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

<style scoped lang="scss">
:deep(.TE-drop-down-block__header) {
  top: 47px;
}

.TE-theme-styles-block {
  &__styles {
    border-bottom: 0;
  }
}
</style>
