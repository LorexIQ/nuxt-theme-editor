<script setup lang="ts">

</script>

<template>
  <div class="layout-default">
    <slot />
    <themes-editor />
  </div>
</template>

<style scoped lang="scss">
.layout-default {
  display: grid;
  grid-template-columns: auto 400px;
  height: 100vh;
}
</style>
