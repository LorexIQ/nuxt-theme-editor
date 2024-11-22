<script setup lang="ts">
import useThemesEditor from '../composables/useThemesEditor';
import BlockThemes from './subs/BlockThemes.vue';
import { computed } from '#imports';

const themesEditor = useThemesEditor();

const themes = computed(() => Object.values(themesEditor.getThemes()));
</script>

<template>
  <div class="themes-editor">
    <div class="themes-editor__header">
      <div class="themes-editor__header__title">
        ThemesEditor
      </div>
      <div class="themes-editor__header__version">
        {{ themesEditor.getConfig().meta.version }}
      </div>
    </div>
    <div class="themes-editor__content">
      <BlockThemes
        type="system"
        :themes="themes"
        is-open
      />
      <BlockThemes
        type="global"
        :themes="themes"
      />
      <BlockThemes
        type="local"
        :themes="themes"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.themes-editor {
  --bg: #fff;
  --bgHeader: #f6f6f6;
  --bgBlockHeader: #f6f6f6;
  --shadow: rgba(0, 0, 0, 0.1);
  --title: #333;
  --titleTransparent: #999;
  --border: rgba(0, 0, 0, 0.1);
  --border-radius: 5px;

  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border-left: 1px solid var(--border);
  background-color: var(--bg);
  overflow: hidden;
  user-select: none;

  & * {
    font-family: 'Roboto', sans-serif;
  }
  &__header {
    position: relative;
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
