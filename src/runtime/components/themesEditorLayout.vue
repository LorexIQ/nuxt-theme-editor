<script setup lang="ts">

</script>

<template>
  <div class="TE-layout">
    <div class="TE-layout__custom">
      <slot />
    </div>
    <themes-editor>
      <template #preview>
        <slot name="preview" />
      </template>
    </themes-editor>
  </div>
</template>

<style scoped lang="scss">
.TE-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &__custom {
    overflow: auto;
  }
}
</style>
