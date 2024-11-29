<script setup lang="ts">
import type { ModuleClient } from '../../types';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();

const openedPage = computed(() => router.getPath());
const isAnotherPage = computed(() => openedPage.value !== 'index');
</script>

<template>
  <div
    class="TE-editor-header"
    :class="{ 'TE-editor-header--another-page': isAnotherPage }"
  >
    <div class="TE-editor-header__title">
      T
    </div>
    <div class="TE-editor-header__title">
      hemes
    </div>
    <div class="TE-editor-header__title">
      E
    </div>
    <div class="TE-editor-header__title">
      ditor
    </div>
    <div class="TE-editor-header__version">
      {{ client.getConfig().meta.version }}
    </div>
    <transition-expand direction="horizontal">
      <div
        v-if="isAnotherPage"
        class="TE-editor-header__title"
      >
        &nbsp;&nbsp;&nbsp; > {{ router.getCurrentPage()?.title ?? router.getPath() }}
      </div>
    </transition-expand>
  </div>
</template>

<style scoped lang="scss">
.TE-editor-header {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 74px auto 60px 0 auto;
  align-items: center;
  justify-content: center;
  background-color: var(--bgHeader);
  box-shadow: 0 0 10px var(--shadow);
  transition: .3s;

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
  }
}
</style>
