<script setup lang="ts">

</script>

<template>
  <div class="layout-default">
    <div class="layout-default__content">
      <slot />
    </div>
    <themes-editor />
  </div>
</template>

<style scoped lang="scss">
.layout-default {
  display: grid;
  grid-template-columns: 1fr 400px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &__content {
    overflow: auto;
  }
}
</style>
