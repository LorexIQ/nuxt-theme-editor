<script setup lang="ts">
import useThemeEditor from '../../composables/useThemeEditor';
import EditorHeader from '../widgets/EditorHeader.vue';
import Error404 from '../views/Error404.vue';
import { computed } from '#imports';

const client = useThemeEditor();
const router = client.getRouter();

const pageComponent = computed(() => router.route.page?.component ?? Error404);
const addStyles = computed(() => ({
  '--alpha': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAChJREFUKFNjPHP19n8GNGCspYIuxMA4FBT+//8fwzNnr93B9MwQUAgAe7I0XsEPG9EAAAAASUVORK5CYII=)'
}));
</script>

<template>
  <div
    :id="client.getConfig().keys.editor"
    class="TE-block"
  >
    <EditorHeader :client="client" />

    <div
      class="TE-block__content"
      :style="addStyles"
    >
      <transition :name="router.getTransitionName()">
        <Component
          :is="pageComponent"
          :client="client"
        >
          <template #preview>
            <slot name="preview" />
          </template>
        </Component>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
.TE-block, .TE-sandbox {
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

  .fade {
    &-enter-active, &-leave-active {
      transition: .3s opacity;
    }
    &-enter-to, &-leave-from {
      opacity: 1;
    }
    &-leave-to, &-enter-from {
      opacity: 0;
    }
  }
}
</style>

<style scoped lang="scss">
.TE-block {
  display: grid;
  grid-template-rows: auto 1fr;
  min-width: 400px;
  width: 400px;
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
