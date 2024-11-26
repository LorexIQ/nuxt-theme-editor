<script setup lang="ts">
import useThemesEditor from '../composables/useThemesEditor';
import ThemesList from './views/ThemesList.vue';

const client = useThemesEditor();
</script>

<template>
  <div
    :id="client.getConfig().keys.editor"
    class="TE-root"
  >
    <div class="TE-root__header">
      <div class="TE-root__header__title">
        ThemesEditor
      </div>
      <div class="TE-root__header__version">
        {{ client.getConfig().meta.version }}
      </div>
    </div>
    <div class="TE-root__content">
      <ThemesList :client="client" />
    </div>
  </div>
</template>

<style lang="scss">
.TE-root {
  & * {
    font-family: 'Roboto', sans-serif;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      height: 4px;
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 2px;
      background-color: var(--bg);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: var(--border);
    }
  }
}
</style>

<style scoped lang="scss">
.TE-root {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border-left: 1px solid var(--border);
  background-color: var(--bg);
  overflow: hidden;
  user-select: none;

  &__header {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: auto 0;
    align-items: center;
    justify-content: center;
    background-color: var(--bgHeader);
    box-shadow: 0 0 10px var(--shadow);

    &__title {
      font-family: 'Segoe Print', sans-serif;
      font-weight: 600;
      font-size: 24px;
      padding: 4px 0;
      color: var(--title);
    }
    &__version {
      font-weight: 500;
      font-size: 8px;
      min-width: max-content;
      margin: -15px 0 0 5px;
      padding: 1px 4px;
      color: #fff;
      background-color: var(--title);
      border-radius: 4px;
    }
  }
  &__content {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
