<script setup lang="ts">
import TextRunner from '../shared/TextRunner.vue';
import type { ModuleDefaultStyleKeys } from '../../types';
import { computed } from '#imports';

export type StyleContextMenuData = [MouseEvent, ModuleDefaultStyleKeys, string];

type Props = {
  id: string;
  styleKey: string;
  styles: Record<string, string>;
  rawStyles: Record<string, string>;
};
type Emits = {
  (e: 'contextMenuOpen', v: StyleContextMenuData): void;
  (e: 'click', v: StyleContextMenuData): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currentValue = computed(() => props.styles[props.styleKey]);
const rawValue = computed(() => props.rawStyles[props.styleKey]);
</script>

<template>
  <div
    class="TE-style-edit-block"
    @click="emit('click', [$event, id as any, rawValue])"
    @contextmenu.prevent="emit('contextMenuOpen', [$event, id as any, rawValue])"
  >
    <div
      class="TE-style-edit-block__picker"
      :style="`background-color: ${currentValue};`"
    />
    <div class="TE-style-edit-block__hr" />
    <div class="TE-style-edit-block__key">
      <TextRunner>{{ styleKey }}</TextRunner>
    </div>
    <div class="TE-style-edit-block__hr" />
    <div class="TE-style-edit-block__value">
      <TextRunner>{{ rawValue }}</TextRunner>
    </div>
  </div>
</template>

<style scoped lang="scss">
.TE-style-edit-block {
  display: grid;
  align-items: center;
  grid-template-columns: 27px 1px 1fr 1px 1fr;
  gap: 5px;
  padding: 4px;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  transition: .3s;
  cursor: pointer;

  &__picker {
    aspect-ratio: 1;
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 5px;
  }
  &__hr {
    height: 100%;
    border-left: 1px solid var(--border);
  }
  &__key {
    width: 100%;
    overflow: hidden;
  }
  &__value {
    width: 100%;
    overflow: hidden;
    text-align: right;
  }

  &:hover {
    background-color: var(--bgHover);
  }
}
</style>
