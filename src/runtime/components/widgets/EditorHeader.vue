<script setup lang="ts">
import type { ModuleClient } from '../../types';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();

const logoParts: string[] = [
  'T',
  'heme',
  'E',
  'ditor'
];

const openedPage = computed(() => router.route.path);
const isAnotherPage = computed(() => openedPage.value !== 'index');
const isEditedPage = computed(() => client.getSelectedEditedThemeId());

function onGoHome() {
  if (isEditedPage.value) {
    router.push(`editThemeStylesCancel?themeId=${isEditedPage.value}&cancelLink=${router.route.path}`, 'tab-fade-lr');
  } else {
    router.push('index', 'tab-fade-rl');
  }
}
</script>

<template>
  <div
    class="TE-editor-header"
    :class="{ 'TE-editor-header--another-page': isAnotherPage }"
  >
    <div
      v-for="part of logoParts"
      :key="part"
      class="TE-editor-header__title TE-editor-header__title--logo"
      @click="onGoHome"
    >
      {{ part }}
    </div>
    <div class="TE-editor-header__version">
      {{ client.getConfig().meta.version }}
    </div>
    <transition-expand direction="horizontal">
      <div
        v-if="isAnotherPage"
        class="TE-editor-header__title"
      >
        &nbsp;&nbsp;&nbsp; > {{ router.route?.title ?? router.route.path }}
      </div>
    </transition-expand>
  </div>
</template>

<style scoped lang="scss">
.TE-editor-header {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: auto 64px auto 60px 0 auto;
  align-items: center;
  justify-content: center;
  background-color: var(--bgHeader);
  box-shadow: 0 0 10px var(--shadow);
  transition: .3s grid-template-columns;

  &__title {
    font-family: 'Segoe Print', sans-serif;
    font-weight: 600;
    font-size: 24px;
    white-space: nowrap;
    padding: 4px 0;
    color: var(--title);
    overflow: hidden;
    transition: .3s;
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
  &--another-page {
    grid-template-columns: auto 0 auto 0 0 auto;

    .TE-editor-header__title--logo {
      cursor: pointer;
    }
  }
}
</style>
