<template>
  <div class="theme-preview">
    <div class="theme-preview__block" />
    <div class="theme-preview__block" />
    <div class="theme-preview__block" />
    <div class="theme-preview__block" />
    <div class="theme-preview__block" />
    <div class="theme-preview__block" />
  </div>
</template>

<style scoped lang="scss">
$rectSize: 20px;

.theme-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
  height: 100%;

  &__block {
    &:first-child {
      background-color: var(--defaultPreviewCardBG1);
    }
    &:nth-child(2) {
      background-color: var(--defaultPreviewCardBG2);
    }
    &:nth-child(3) {
      background-color: var(--defaultPreviewCardBG3);
    }
    &:nth-child(4) {
      background-color: var(--defaultPreviewCardBG4);
    }
    &:nth-child(5) {
      background-color: var(--defaultPreviewCardBG5);
    }
    &:last-child {
      background-color: var(--defaultPreviewCardBG6);
    }
  }
}
</style>
