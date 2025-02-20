<script setup lang="ts">
import type { ModuleLocalStorageThemeMini, ModuleTheme } from '../../types';
import IconsStore from '../shared/IconsStore.vue';
import useLang from '../../helpers/useLang';
import { computed } from '#imports';

type Props = {
  theme: ModuleTheme | ModuleLocalStorageThemeMini;
  useGlobalStyles?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  useGlobalStyles: true
});
const theme = computed(() => props.theme as Partial<ModuleTheme>);

const styles = computed(() => {
  const _styles = JSON.parse((theme.value as any).previewStylesJSON ?? '{}');
  return Object.keys(_styles).reduce((acc, styleKey) => ({ ...acc, [`--${styleKey}`]: _styles[styleKey] }), {});
});
</script>

<template>
  <div class="TE-theme-block">
    <div
      class="TE-theme-block__preview"
      :style="styles"
      v-bind="useGlobalStyles ? { [`theme-${theme.id}-preview`]: '' } : {}"
    >
      <slot name="preview" />
    </div>
    <div class="TE-theme-block__info">
      <div
        class="TE-theme-block__info__name"
        :class="{ 'TE-theme-block__info__name--transparent': !theme.name }"
      >
        <transition-expand direction="horizontal">
          <div
            v-if="theme.isInCache && !theme.isInit"
            class="TE-theme-block__info__name__cache"
          >
            {{ useLang('themeCard.status.cache') }}
          </div>
        </transition-expand>
        {{ theme.name || useLang('themeCard.emptyName') }}
      </div>
      <div
        class="TE-theme-block__info__description"
        :class="{ 'TE-theme-block__info__description--transparent': !theme.description }"
      >
        <span>{{ theme.description || useLang('themeCard.emptyDescription') }}</span>
      </div>
    </div>
    <slot name="status" />
    <transition name="fade">
      <div
        v-if="theme.loader?.status"
        class="TE-theme-block__loader"
      >
        <IconsStore icon="Spinner" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.TE-theme-block {
  position: relative;
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
    line-height: 18px;
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
      line-height: 21px;
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
        height: 30px;
        background: linear-gradient(90deg, transparent 0%, var(--bg) 100%);
      }

      &__cache {
        font-size: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 5px;
        margin-right: 5px;
        border-radius: 4px;
        background-color: var(--statusCacheBg);
        color: var(--statusCacheTitle);
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

      & span {
        color: inherit;
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

      &--transparent {
        color: var(--titleTransparent)
      }
    }
  }
  &__loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bgGlass);

    & svg {
      color: var(--titleTransparent)
    }
  }
}
</style>
