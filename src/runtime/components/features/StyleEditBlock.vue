<script setup lang="ts">
import type { Ref } from 'vue';
import TextRunner from '../shared/TextRunner.vue';
import type { ModuleDefaultStyleKeys } from '../../types';
import { computed, ref } from '#imports';
import type { ColorPicker } from '#components';

export type StylePickerData = {
  color: Ref<string | undefined>;
  hide: () => void;
  show: (event: MouseEvent) => void;
};
export type StyleContextMenuData = [MouseEvent, StylePickerData, ModuleDefaultStyleKeys, string];

type Props = {
  id: string;
  styleKey: string;
  styles: Record<string, string>;
  rawStyles: Record<string, string>;
};
type Emits = {
  (e: 'contextMenuOpen', v: StyleContextMenuData): void;
  (e: 'click', v: StyleContextMenuData): void;
  (e: 'inheritanceClick', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const pickerRef = ref<StylePickerData>();

const currentValue = computed(() => props.styles[props.styleKey]);
const rawValue = computed(() => props.rawStyles[props.styleKey]);
const isCircular = computed(() => currentValue.value === 'CIRCULAR');
</script>

<template>
  <div
    :id="`style:${props.id}`"
    class="TE-style-edit-block"
    :class="{
      'TE-style-edit-block--circular': isCircular,
    }"
    @contextmenu.prevent="emit('contextMenuOpen', [$event, pickerRef!, id as any, rawValue])"
  >
    <color-picker
      ref="pickerRef"
      :model-value="currentValue"
      with-alpha
      with-initial-color
      with-eye-dropper
      with-hex-input
      with-rgb-input
      with-colors-history
      @change="$props.rawStyles[styleKey] = $event.hex"
    >
      <div
        class="TE-style-edit-block__picker"
        :style="`--current: ${currentValue};`"
        @click="emit('click', [$event, pickerRef!, id as any, rawValue])"
      />
    </color-picker>
    <hr class="TE-style-edit-block__hr">
    <div class="TE-style-edit-block__key">
      <TextRunner>{{ styleKey }}</TextRunner>
    </div>
    <hr class="TE-style-edit-block__hr">
    <div
      v-if="rawValue.startsWith('$')"
      class="TE-style-edit-block__inheritance"
    >
      <span v-if="isCircular">Circular Inheritance</span>
      <span v-else>Inheritance from</span>
      <div
        class="TE-style-edit-block__inheritance__value"
        @click="emit('inheritanceClick', rawValue)"
      >
        <TextRunner>{{ rawValue }}</TextRunner>
      </div>
    </div>
    <div
      v-else
      class="TE-style-edit-block__value"
    >
      <TextRunner>{{ rawValue }}</TextRunner>
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin blink($color) {
  animation: blink-animation 1s infinite;

  @keyframes blink-animation {
    0%, 100% {
      background-color: var(--bg);
    }
    50% {
      background-color: $color;
    }
  }
}

.TE-style-edit-block {
  --inheritanceBgHover: var(--bgHover);

  display: grid;
  align-items: center;
  grid-template-columns: auto 1px 1fr 1px 1fr;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  transition: .3s background-color;

  & > div {
    width: 100%;
    height: 100%;
    padding: 4px;
    overflow: hidden;
  }
  &__picker {
    position: relative;
    aspect-ratio: 1;
    width: 30px;
    border: 1px solid var(--border);
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;

    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    &::before {
      background: var(--alpha);
    }
    &::after {
      background: var(--current);
    }
  }
  &__hr {
    height: 100%;
    border: 0;
    border-left: 1px solid var(--border);
  }
  &__key {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
  }
  &__inheritance {
    position: relative;

    & span {
      font-size: 10px;
      position: absolute;
      top: -2px;
      right: 10px;
      color: var(--titleTransparent);
      background-color: inherit;
      transition: .3s;
    }
    &__value {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 4px;
      border: 1px solid var(--border);
      border-radius: 3px;
      background-color: inherit;
      overflow: hidden;
      cursor: pointer;
      text-align: right;
      transition: .3s background-color;

      &:hover {
        background-color: rgba(0, 0, 0, 0.025);
      }
    }
  }
  &__value {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    text-align: right;
  }

  &--circular {
    @include blink(var(--animationCircular));
  }
  &--alert {
    background-color: var(--animationAlert) !important;
  }
}
</style>
