<script setup lang="ts">
import IconArrow from '../icons/IconArrow.vue';
import IconPlus from '../icons/IconPlus.vue';
import type { ModuleThemeRootReturn, ModuleThemeType } from '../../types';
import ThemePreview from './ThemePreview.vue';
import { ref, computed } from '#imports';

type Props = {
  type: ModuleThemeType;
  themes: ModuleThemeRootReturn[];
  isOpen?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
});

const isOpened = ref(props.isOpen);
const isAddActive = computed(() => props.type === 'local');
const title = computed(() => {
  switch (props.type) {
    case 'system':
      return 'Системные';
    case 'global':
      return 'Глобальные';
    case 'local':
      return 'Локальные';
    default:
      return 'Unsupported';
  }
});
const themes = computed(() => props.themes.filter(theme => theme.type === props.type));
</script>

<template>
  <div class="block-themes">
    <div
      class="block-themes__title"
      @click="isOpened = !isOpened"
    >
      {{ title }}
      <div
        class="block-themes__title__icon"
        :class="{ 'block-themes__title__icon--open': isOpened }"
      >
        <IconArrow />
      </div>
    </div>
    <transition-expand>
      <div
        v-if="isOpened"
        class="block-themes__content"
      >
        <div
          v-if="isAddActive"
          class="block-themes__content__add"
        >
          <IconPlus />
        </div>
        <template v-if="themes.length">
          <div
            v-for="theme of themes"
            :key="theme.name"
            class="block-themes__content__theme"
          >
            <div class="block-themes__content__theme__preview">
              <slot>
                <ThemePreview />
              </slot>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="block-themes__content__null"
            :class="{ 'block-themes__content__null--simplify': !isAddActive }"
          >
            Список тем пуст
          </div>
        </template>
      </div>
    </transition-expand>
  </div>
</template>

<style scoped lang="scss">
.block-themes {
  &__title {
    font-size: 12px;
    font-weight: 600;
    display: grid;
    grid-template-columns: auto 12px;
    justify-content: space-between;
    gap: 8px;
    padding: 10px;
    border-bottom: 1px solid var(--border);
    color: var(--title);
    background-color: var(--bgBlockHeader);
    cursor: pointer;

    &__icon {
      display: flex;
      align-items: center;
      transition: .3s;

      &--open {
        transform: scaleY(-1);
      }
    }
  }
  &__content {
    padding: 10px;
    border-bottom: 1px solid var(--border);

    &__add {
      display: flex;
      justify-content: center;
      padding: 5px;
      color: var(--title);
      border: 1px solid var(--border);
      border-radius: 5px;

      & svg {
        font-size: 30px;
      }
    }
    &__theme {

    }
    &__null {
      font-size: 12px;
      padding-top: 10px;
      color: var(--titleTransparent);
      text-align: center;

      &--simplify {
        padding-top: 0;
      }
    }
  }
}
</style>
