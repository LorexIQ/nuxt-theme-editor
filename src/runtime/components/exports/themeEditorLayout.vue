<script setup lang="ts">
import useThemesEditor from '../../composables/useThemesEditor';
import ThemePreview from '../features/ThemePreview.vue';
import ThemeEditorBlock from './themeEditorBlock.vue';
import { computed } from '#imports';

const client = useThemesEditor();
const isBlockVisible = computed(() => client.getBlockStatus());
</script>

<template>
  <div
    class="TE-layout"
    :class="{ 'TE-layout--opened': isBlockVisible }"
  >
    <div class="TE-layout__custom">
      <slot />
    </div>
    <transition-expand direction="horizontal">
      <ThemeEditorBlock v-if="isBlockVisible">
        <template #preview>
          <slot name="preview">
            <ThemePreview />
          </slot>
        </template>
      </ThemeEditorBlock>
    </transition-expand>
  </div>
</template>

<style scoped lang="scss">
.TE-layout {
  display: grid;
  grid-template-columns: 1fr 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: .3s grid-template-columns;

  &__custom {
    overflow: auto;
  }

  &--opened {
    grid-template-columns: 1fr 400px;
  }
}
</style>
