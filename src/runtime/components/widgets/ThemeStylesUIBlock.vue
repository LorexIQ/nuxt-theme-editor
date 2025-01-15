<script setup lang="ts">
import type { StyleContextMenuData } from '../features/StyleEditBlock.vue';
import StyleEditBlock from '../features/StyleEditBlock.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import type { ModuleClient } from '../../types';
import unwrap from '../../helpers/client/unwrap';
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
const theme = computed(() => client.getEditedTheme()!);
const themeUIStyles = computed(() => unwrap.get(theme.value.getPrepareStylesUI()));
const themeUITargetStyles = computed(() => unwrap.get(theme.value.getStylesUI('edited')));
</script>

<template>
  <DropDownBlock
    class="TE-theme-styles-ui-block"
    expand-enabled
  >
    <template #title>
      Editor UI
    </template>
    <template #default>
      <div class="TE-theme-styles-ui-block__styles">
        <template
          v-for="styleKey of Object.keys(themeUIStyles)"
          :key="`${client.getRuntimeUIId()}.${styleKey}`"
        >
          <StyleEditBlock
            :id="`${client.getRuntimeUIId()}.${styleKey}`"
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
