<script setup lang="ts">
type Props = {
  decor?: 'default' | 'success' | 'error';
};

withDefaults(defineProps<Props>(), {
  decor: 'default'
});
</script>

<template>
  <button
    class="TE-is-button"
    :class="`TE-is-button--${decor}`"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.TE-is-button {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 6px 15px;
  border-radius: 5px;
  border: 1px solid;
  cursor: pointer;
  transition: .3s;

  &--default {
    border-color: var(--buttonDefaultBorder);
    color: var(--buttonDefaultText);
    background-color: var(--buttonDefaultBg);

    &:hover {
      color: var(--buttonDefaultTextHover);
      background-color: var(--buttonDefaultBgHover);
    }
  }
  &--success {
    border-color: var(--buttonSuccessBorder);
    color: var(--buttonSuccessText);
    background-color: var(--buttonSuccessBg);

    &:hover {
      color: var(--buttonSuccessTextHover);
      background-color: var(--buttonSuccessBgHover);
    }
  }
  &--error {
    border-color: var(--buttonErrorBorder);
    color: var(--buttonErrorText);
    background-color: var(--buttonErrorBg);

    &:hover {
      color: var(--buttonErrorTextHover);
      background-color: var(--buttonErrorBgHover);
    }
  }
}
</style>
