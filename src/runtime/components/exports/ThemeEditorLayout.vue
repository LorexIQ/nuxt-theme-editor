<script setup lang="ts">
import useThemeEditor from '../../composables/useThemeEditor';
import ThemePreview from '../features/ThemePreview.vue';
import ThemeEditorBlock from '../ThemeEditorBlock.vue';
import { computed, onMounted, onUnmounted, ref } from '#imports';

const popupWindow = ref<WindowProxy>();
const client = useThemeEditor();
const isPopup = ref(false);
const isBlockVisible = computed(() => client.getBlockStatus() && !isPopup.value);

function togglePopup() {
  isPopup.value = !isPopup.value;

  if (isPopup.value) {
    popupWindow.value = window.open('/popup', 'popupWindow', `width=402,height=${window.innerHeight},resizable=no`)!;
  } else {
    popupWindow.value!.close();
  }
}
function parseMessage(event: any) {
  const data = event.data;

  if (data.popupClosed) {
    isPopup.value = false;
  }
  if (data.storageUpdated) {
    client.updateStorage(true);
    client.setThemesBlockGlobalStatus(0);
  }
}

onMounted(() => window.addEventListener('message', parseMessage));
onUnmounted(() => window.removeEventListener('message', parseMessage));
</script>

<template>
  <div
    class="TE-layout"
    :class="{ 'TE-layout--opened': isBlockVisible }"
  >
    <div class="TE-layout__custom">
      <button @click="togglePopup">
        {{ isPopup ? 'Вернуть на место' : 'Открыть во всплывающем окне' }}
      </button>
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
