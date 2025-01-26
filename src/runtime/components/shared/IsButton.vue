<script setup lang="ts">
import useClient from '../../helpers/client/useClient';
import type { ModuleSandboxContextMenuItem } from '../../types';
import IconsStore from './IconsStore.vue';
import { computed } from '#imports';

type Props = {
  decor?: 'default' | 'success' | 'error';
  items?: ModuleSandboxContextMenuItem[];
};
type Emits = {
  (e: 'click', v: MouseEvent): void;
  (e: 'clickItem', v: ModuleSandboxContextMenuItem): void;
};

const props = withDefaults(defineProps<Props>(), {
  decor: 'default'
});
const emit = defineEmits<Emits>();

const client = useClient();
const sandbox = computed(() => client.value.getSandbox());

function openItemsMenu(event: MouseEvent) {
  if (!props.items) return;

  sandbox.value.openCustomContextMenu(event, props.items);
}
</script>

<template>
  <button
    class="TE-is-button"
    :class="`TE-is-button--${decor}`"
  >
    <span
      class="TE-is-button__content"
      @click="emit('click', $event)"
    >
      <slot />
    </span>
    <span
      v-if="items?.length"
      class="TE-is-button__actions"
      @click="openItemsMenu"
    >
      <IconsStore icon="Dots" />
    </span>
  </button>
</template>

<style scoped lang="scss">
@mixin buttonDecor($borderColor, $textColor, $bgColor, $textHoverColor, $bgHoverColor) {
  border-color: $borderColor;

  .TE-is-button {
    &__content, &__actions {
      color: $textColor;
      background-color: $bgColor;

      &:hover {
        color: $textHoverColor;
        background-color: $bgHoverColor;
      }
    }
    &__actions {
      border-left: 1.5px solid $borderColor;
    }
  }
}

.TE-is-button {
  display: flex;
  border-radius: 5px;
  border: 1px solid;
  cursor: pointer;
  transition: .3s;
  overflow: hidden;

  &__content {
    letter-spacing: 1px;
    font-size: 16px;
    font-weight: 600;
    height: 100%;
    padding: 6px 15px;
    white-space: nowrap;
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 15px;

    & svg {
      width: 4px;
      color: inherit;
    }
  }

  &--default {
    @include buttonDecor(
      var(--buttonDefaultBorder),
      var(--buttonDefaultText),
      var(--buttonDefaultBg),
      var(--buttonDefaultTextHover),
      var(--buttonDefaultBgHover),
    );
  }
  &--success {
    @include buttonDecor(
        var(--buttonSuccessBorder),
        var(--buttonSuccessText),
        var(--buttonSuccessBg),
        var(--buttonSuccessTextHover),
        var(--buttonSuccessBgHover),
    );
  }
  &--error {
    @include buttonDecor(
        var(--buttonErrorBorder),
        var(--buttonErrorText),
        var(--buttonErrorBg),
        var(--buttonErrorTextHover),
        var(--buttonErrorBgHover),
    );
  }
}
</style>
