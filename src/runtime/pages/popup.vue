<script setup lang="ts">
import { createApp } from 'vue';
import useThemeEditor from '../composables/useThemeEditor';
import ThemeEditorBlock from '../components/ThemeEditorBlock.vue';
import ThemePreview from '../components/features/ThemePreview.vue';
import { onMounted, h, useHead } from '#imports';

const client = useThemeEditor();
client.setBlockStatus(true);

function getChildByClassName(element: HTMLElement, name: string) {
  for (const child of element.children) {
    if (child.className === name) return child;
  }
}
function checkPopupWindow() {
  if (!client.getPopupSelfStatus()) window.location.href = '/';
}

window.onunload = () => client.useEvBus({
  type: 'close',
  page: client.getRouter().route.fullPath
});

onMounted(() => {
  checkPopupWindow();

  const nuxtElement = document.getElementById('__nuxt');

  if (nuxtElement && client.getPopupSelfStatus()) {
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
