<script setup lang="ts">
type Props = {
  decor?: '1' | '2';
};

const props = defineProps<Props>();
const isVisible = ref(false);
const isVisible2 = ref(false);

useThemeBlock('sidebar', {
  pathModificator: props.decor
});
</script>

<template>
  <div class="test-blocks">
    <div
      class="test-blocks__left"
      @click="isVisible = !isVisible"
    />
    <div
      class="test-blocks__right"
      @click="isVisible2 = !isVisible2"
    />
    <test-blocks2
      v-if="isVisible"
      :decor="decor"
    />
    <transition name="fade">
      <test-blocks2 v-if="isVisible2" />
    </transition>
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
