<script setup lang="ts">
import type { ModuleClient, ModuleThemeRootReturn } from '../../types';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
  theme: ModuleThemeRootReturn;
  viewMode?: 'vertical' | 'horizontal';
};

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'vertical'
});
const client = props.client;
const theme = props.theme;

const isLightTheme = computed(() => client.getSelectedLightThemeId() === theme.id);
const isDarkTheme = computed(() => client.getSelectedDarkThemeId() === theme.id);
const isLightDartTheme = computed(() => isLightTheme.value && isDarkTheme.value);
const isActiveTheme = computed(() => client.getSelectedThemeId() === theme.id);
const isBoxActive = computed(() => isLightTheme.value || isDarkTheme.value || isActiveTheme.value);
</script>

<template>
  <div
    class="TE-theme-block-status"
    :class="{
      [`TE-theme-block-status--${viewMode}`]: true,
      [`TE-theme-block-status--${viewMode}-active`]: isBoxActive,
    }"
  >
    <transition name="fade">
      <div
        v-if="isActiveTheme"
        class="TE-theme-block-status__active"
      >
        Active
      </div>
      <div
        v-else-if="isLightDartTheme"
        class="TE-theme-block-status__light_dark"
      >
        Light/Dark
      </div>
      <div
        v-else-if="isLightTheme"
        class="TE-theme-block-status__light"
      >
        Light
      </div>
      <div
        v-else-if="isDarkTheme"
        class="TE-theme-block-status__dark"
      >
        Dark
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.TE-theme-block-status {
  position: relative;
  font-size: 12px;
  width: 0;
  height: 100%;
  writing-mode: vertical-rl;
  overflow: hidden;
  transition: .3s;

  & > div {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &__active {
    color: var(--statusActiveTitle);
    background-color: var(--statusActiveBg);
    z-index: 1;
  }
  &__light_dark {
    font-size: 10px;
    color: var(--statusLightDarkTitle);
    background-color: var(--statusLightDarkBg);
  }
  &__light {
    color: var(--statusLightTitle);
    background-color: var(--statusLightBg);
  }
  &__dark {
    color: var(--statusDarkTitle);
    background-color: var(--statusDarkBg);
  }

  &--vertical {
    &-active {
      width: 20px;
    }
  }
  &--horizontal {
    writing-mode: horizontal-tb;

    &-active {
      width: 55px;
    }
  }
}

.fade {
  &-enter-active, &-leave-active {
    transition: .3s;
  }
  &-enter-to, &-leave-from {
    opacity: 1;
  }
  &-leave-to, &-enter-from {
    opacity: 0;
  }
}
</style>
