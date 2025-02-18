<script setup lang="ts">
type Props = {
  decor?: '1' | '2';
};

const props = defineProps<Props>();
useThemeBlock('sidebar', {
  pathModificator: props.decor
});
</script>

<template>
  <div class="test-blocks">
    <div class="test-blocks__left" />
    <div class="test-blocks__right" />
  </div>
</template>

<style scoped lang="scss">
.test-blocks {
  display: flex;
  gap: 5px;

  & > div {
    width: 100px;
    height: 100px;
    border: 1px solid;
  }
  &__left {
    background-color: var(--left);
  }
  &__right {
    background-color: var(--right);
  }
}
</style>
