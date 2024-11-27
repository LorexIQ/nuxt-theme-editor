<script setup lang="ts">
import useThemesEditor from '../composables/useThemesEditor';
import ThemesList from './views/ThemesList.vue';
import ThemeCreate from './views/ThemeCreate.vue';
import EditorHeader from './views/EditorHeader.vue';
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
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.tab-fade-lr {
  &-enter-active, &-leave-active {
    position: absolute;
    width: 100%;
    transition: .3s;
  }
  &-leave-to {
    opacity: 0;
    transform: scale(.9) translateX(-100%);
  }
  &-enter-from {
    opacity: 0;
    transform: scale(.9) translateX(100%);
  }
}
.tab-fade-rl {
  &-enter-active, &-leave-active {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: .3s;
  }
  &-leave-to {
    opacity: 0;
    transform: scale(.9) translateX(100%);
  }
  &-enter-from {
    opacity: 0;
    transform: scale(.9) translateX(-100%);
  }
}
</style>
