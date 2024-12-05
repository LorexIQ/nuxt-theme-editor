<script setup lang="ts">
type Props = {
  decor?: 'default' | 'green';
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
  &--green {
    border-color: var(--buttonGreenBorder);
    color: var(--buttonGreenText);
    background-color: var(--buttonGreenBg);

    &:hover {
      color: var(--buttonGreenTextHover);
      background-color: var(--buttonGreenBgHover);
    }
  }
}
</style>
