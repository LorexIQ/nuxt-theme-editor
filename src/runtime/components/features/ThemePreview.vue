<template>
  <div class="TE-theme-preview">
    <div class="TE-theme-preview__block" />
    <div class="TE-theme-preview__block" />
    <div class="TE-theme-preview__block" />
    <div class="TE-theme-preview__block" />
    <div class="TE-theme-preview__block" />
    <div class="TE-theme-preview__block" />
  </div>
</template>

<style scoped lang="scss">
.TE-theme-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
  height: 100%;

  &__block {
    &:first-child {
      background-color: var(--bg1);
    }
    &:nth-child(2) {
      background-color: var(--bg2);
    }
    &:nth-child(3) {
      background-color: var(--bg3);
    }
    &:nth-child(4) {
      background-color: var(--bg4);
    }
    &:nth-child(5) {
      background-color: var(--bg5);
    }
    &:last-child {
      background-color: var(--bg6);
    }
  }
}
</style>
