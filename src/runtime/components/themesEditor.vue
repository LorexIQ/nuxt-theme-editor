<script setup lang="ts">
import useThemesEditor from '../composables/useThemesEditor';
import EditorHeader from './widgets/EditorHeader.vue';
import ThemesList from './views/ThemesList.vue';
import ThemeCreate from './views/ThemeCreate.vue';
import ThemeDelete from './views/ThemeDelete.vue';
import ThemeEditInfo from './views/ThemeEditInfo.vue';
import ThemeEditStyles from './views/ThemeEditStyles.vue';
import Error404 from './views/Error404.vue';
import { computed } from '#imports';

const client = useThemesEditor();
const router = client.getRouter();

const pageComponent = computed(() => {
  switch (router.getPath()) {
    case 'index':
      return ThemesList;
    case 'newTheme':
      return ThemeCreate;
    case 'deleteTheme':
      return ThemeDelete;
    case 'editThemeInfo':
      return ThemeEditInfo;
    case 'editThemeStyles':
      return ThemeEditStyles;
    default:
      return Error404;
  }
});
</script>

<template>
  <div
    :id="client.getConfig().keys.editor"
    class="TE-root"
  >
    <EditorHeader :client="client" />

    <div class="TE-root__content">
      <transition :name="router.getTransitionName()">
        <Component
          :is="pageComponent"
          :client="client"
        />
      </transition>
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
