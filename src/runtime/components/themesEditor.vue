<script setup lang="ts">
import useThemesEditor from '../composables/useThemesEditor';
import ThemesList from './views/ThemesList.vue';
import ThemeCreate from './views/ThemeCreate.vue';
import { computed, ref } from '#imports';

const client = useThemesEditor();

const selectedPage = ref('index');
const transitionAnimation = ref();
const pageName = computed(() => {
  switch (selectedPage.value) {
    case 'index':
      return '';
    case 'new':
      return 'New Theme';
    default:
      return '404';
  }
});
const isAnotherPage = computed(() => selectedPage.value !== 'index');

function onNewTheme(parentTheme?: string) {
  selectedPage.value = 'new';
}
function onGoIndex() {
  selectedPage.value = 'new';
}
</script>

<template>
  <div
    :id="client.getConfig().keys.editor"
    class="TE-root"
  >
    <div
      class="TE-root__header"
      :class="{ 'TE-root__header--another-page': isAnotherPage }"
    >
      <div class="TE-root__header__title">
        T
      </div>
      <div class="TE-root__header__title">
        hemes
      </div>
      <div class="TE-root__header__title">
        E
      </div>
      <div class="TE-root__header__title">
        ditor
      </div>
      <div class="TE-root__header__version">
        {{ client.getConfig().meta.version }}
      </div>
      <transition-expand direction="horizontal">
        <div
          v-if="isAnotherPage"
          class="TE-root__header__title"
        >
          &nbsp;&nbsp;&nbsp; > {{ pageName }}
        </div>
      </transition-expand>
    </div>
    <div class="TE-root__content">
      <transition name="tab-fade-rl">
        <ThemesList
          v-if="selectedPage === 'index'"
          :client="client"
          @on-new-theme="onNewTheme"
        />
        <ThemeCreate
          v-else-if="selectedPage === 'new'"
          :client="client"
          @on-go-back="selectedPage = 'index'"
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

  &__header {
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
