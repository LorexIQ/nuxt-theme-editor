<script setup lang="ts">
import useThemesEditor from '../composables/useThemesEditor';
import EditorHeader from './widgets/EditorHeader.vue';
import ThemesList from './views/ThemesList.vue';
import ThemeCreate from './views/ThemeCreate.vue';
import Error404 from './views/Error404.vue';

const client = useThemesEditor();
</script>

<template>
  <div
    :id="client.getConfig().keys.editor"
    class="TE-root"
  >
    <EditorHeader :client="client" />

    <div class="TE-root__content">
      <ThemesList :client="client" />
      <ThemeCreate :client="client" />
      <Error404 :client="client" />
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

  &__content {
    position: relative;
    overflow: hidden;
  }
}
</style>
