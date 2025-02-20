<script setup lang="ts">
import { createApp } from 'vue';
import useThemeEditor from '../composables/useThemeEditor';
import ThemeEditorBlock from '../components/ThemeEditorBlock.vue';
import ThemePreview from '../components/features/ThemePreview.vue';
import { onMounted, ref, h, useHead, watch } from '#imports';

const client = useThemeEditor();
const isPopup = ref(false);
client.setBlockStatus(true);

function getChildByClassName(element: HTMLElement, name: string) {
  for (const child of element.children) {
    if (child.className === name) return child;
  }
}
function checkPopupWindow() {
  isPopup.value = window.opener !== null || window.name === 'popupWindow';
  if (!isPopup.value) window.location.href = '/';
}

window.onunload = () => window.opener?.postMessage({ popupClosed: true }, '*');
watch(() => client.getStorage(), () => window.opener?.postMessage({ storageUpdated: true }, '*'));

onMounted(() => {
  checkPopupWindow();

  const nuxtElement = document.getElementById('__nuxt');

  if (nuxtElement && isPopup.value) {
    const popupContainer = getChildByClassName(nuxtElement, 'TE-popup') || document.createElement('div');
    popupContainer.className = 'TE-popup';

    const app = createApp({
      render() {
        return h(ThemeEditorBlock, {}, {
          preview: () => h(ThemePreview)
        });
      }
    });
    app.mount(popupContainer);

    for (const child of nuxtElement.children) nuxtElement.removeChild(child);
    nuxtElement.appendChild(popupContainer);
  }
});

useHead({
  title: 'ThemeEditor'
});
</script>

<template>
  <div />
</template>

<style lang="scss">
html, body, #__nuxt, .TE-popup {
  height: 100%;
}
</style>
