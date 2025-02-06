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
@mixin buttonDecor($borderColor, $textColor, $bgColor, $textHoverColor, $bgHoverColor) {
  border-color: $borderColor;
  color: $textColor;
  background-color: $bgColor;

  &:hover {
    color: $textHoverColor;
    background-color: $bgHoverColor;
  }
}

.TE-is-button {
  letter-spacing: 1px;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  padding: 6px 15px;
  border-radius: 5px;
  border: 1px solid;
  cursor: pointer;
  transition: .3s;
  overflow: hidden;

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
