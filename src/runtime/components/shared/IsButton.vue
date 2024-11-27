<script setup lang="ts">
type Props = {
  decor?: string;
};

defineProps<Props>();
</script>

<template>
  <button class="TE-is-button">
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
  border: 1px solid var(--buttonBorder);
  color: var(--buttonText);
  background-color: var(--buttonBg);
  cursor: pointer;
  transition: .3s;

  &:hover {
    color: var(--buttonTextHover);
    background-color: var(--buttonBgHover);
  }
}
</style>
