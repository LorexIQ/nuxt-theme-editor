<script setup lang="ts">
import type { ModuleThemeRootReturn } from '../../types';
import ThemePreview from './ThemePreview.vue';

type Props = {
  theme: ModuleThemeRootReturn;
};

defineProps<Props>();
</script>

<template>
  <div class="TE-theme-block">
    <div
      class="TE-theme-block__preview"
      v-bind="{ [`theme-default-preview`]: '', [`theme-${theme.id}-preview`]: '' }"
    >
      <slot name="preview">
        <ThemePreview />
      </slot>
    </div>
    <div class="TE-theme-block__info">
      <div
        class="TE-theme-block__info__name"
        :class="{ 'TE-theme-block__info__name--transparent': !theme.name }"
      >
        {{ theme.name || 'Empty' }}
      </div>
      <div
        class="TE-theme-block__info__description"
        :class="{ 'TE-theme-block__info__description--transparent': !theme.meta.description }"
      >
        <span>{{ theme.meta.description || 'Description isn\'t set' }}</span>
      </div>
    </div>
    <slot name="status" />
  </div>
</template>

<style scoped lang="scss">
.TE-theme-block {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  align-items: center;
  width: 100%;
  height: 62px;
  border: 1px solid var(--border);
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: .3s;

  &__preview {
    height: 100%;
    max-height: 100%;
    aspect-ratio: 3 / 2;
    border-right: 1px solid var(--border);
    overflow: hidden;
  }
  &__info {
    position: relative;
    display: grid;
    grid-template-rows: 26px auto;
    align-content: center;
    gap: 2px;
    width: 100%;
    height: 100%;
    padding: 0 10px 5px;
    overflow: hidden;

    &__name {
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: flex-end;
      width: 100%;
      color: var(--title);
      text-wrap: nowrap;
      overflow: hidden;

      &::after {
        position: absolute;
        content: '';
        top: 0;
        right: 0;
        width: 50px;
        height: 26px;
        background: linear-gradient(90deg, transparent 0%, var(--bg) 100%);
      }

      &--transparent {
        color: var(--titleTransparent)
      }
    }
    &__description {
      font-size: 12px;
      padding-bottom: 5px;
      hyphens: auto;
      overflow-wrap: break-word;
      overflow-x: hidden;
      overflow-y: auto;

      &--transparent {
        color: var(--titleTransparent)
      }

      &::after {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        right: 4px;
        height: 15px;
        background: linear-gradient(180deg, transparent 0%, var(--bg) 100%);
      }
    }
  }
  &__status {
    position: relative;
    font-size: 12px;
    height: 100%;
    writing-mode: vertical-rl;
    overflow: hidden;

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
