<script setup lang="ts" generic="T extends any">
type Props = {
  value: T;
  modelValue: T;
};

defineProps<Props>();
</script>

<template>
  <div
    class="TE-is-radio"
    :class="{ 'TE-is-radio--checked': modelValue === value }"
  />
</template>

<style scoped lang="scss">
.TE-is-radio {
  justify-self: center;
  position: relative;
  aspect-ratio: 1;
  width: 18px;
  border-radius: 50%;
  border: 1px solid var(--radioStatic);

  &--checked {
    $space: 2px;
    border: 2px solid var(--radioActive);

    &::after {
      content: "";
      position: absolute;
      top: $space;
      right: $space;
      bottom: $space;
      left: $space;
      border-radius: 50%;
      background-color: var(--radioActive);
    }
  }
}
</style>
