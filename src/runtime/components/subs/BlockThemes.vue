<script setup lang="ts">
import type { ModuleThemeType } from '../../types';
import type { Client } from '../../classes/Client';
import IconArrow from '../icons/IconArrow.vue';
import IconPlus from '../icons/IconPlus.vue';
import ThemePreview from './ThemePreview.vue';
import { ref, computed } from '#imports';

type Props = {
  type: ModuleThemeType;
  client: Client;
  isOpen?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
});

const isOpened = ref(props.isOpen);
const isAddActive = computed(() => props.type === 'local');
const themes = computed(() => Object.values(props.client.getThemes()).filter(theme => theme.type === props.type));
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
        <div
          v-if="themes.length"
          class="block-themes__content__themes"
        >
          <div
            v-for="theme of themes"
            :key="theme.name"
            class="block-themes__content__themes__theme"
            :class="{ 'block-themes__content__themes__theme--active': [client.getSelectedLightThemeName(), client.getSelectedDarkThemeName()].includes(theme.name) || client.getSelectedTheme().name === theme.name }"
            @dblclick="client.selectTheme(theme.name)"
            @contextmenu.prevent="client.getSandbox().openContextMenu($event, theme)"
          >
            <div
              class="block-themes__content__themes__theme__preview"
              v-bind="{ [`theme-${theme.name}-preview`]: '' }"
            >
              <slot>
                <ThemePreview />
              </slot>
            </div>
            <div class="block-themes__content__themes__theme__info">
              <div class="block-themes__content__themes__theme__info__name">
                {{ theme.name }}
              </div>
              <div
                class="block-themes__content__themes__theme__info__description"
                :class="{ 'block-themes__content__themes__theme__info__description--transparent': !theme.meta.description }"
              >
                <span>{{ theme.meta.description || 'Описание не указано' }}</span>
              </div>
            </div>
            <div class="block-themes__content__themes__theme__status">
              <transition name="fade">
                <div
                  v-if="client.getSelectedTheme().name === theme.name"
                  class="block-themes__content__themes__theme__status__active"
                >
                  Active
                </div>
                <div
                  v-else-if="client.getSelectedLightThemeName() === theme.name && client.getSelectedDarkThemeName() === theme.name"
                  class="block-themes__content__themes__theme__status__light_dark"
                >
                  Light/Dark
                </div>
                <div
                  v-else-if="client.getSelectedLightThemeName() === theme.name"
                  class="block-themes__content__themes__theme__status__light"
                >
                  Light
                </div>
                <div
                  v-else-if="client.getSelectedDarkThemeName() === theme.name"
                  class="block-themes__content__themes__theme__status__dark"
                >
                  Dark
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div
          v-else
          class="block-themes__content__null"
          :class="{ 'block-themes__content__null--simplify': !isAddActive }"
        >
          Список тем пуст
        </div>
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
      border-radius: var(--border-radius);

      & svg {
        font-size: 30px;
      }
    }
    &__themes {
      display: flex;
      flex-direction: column;
      gap: 5px;

      &__theme {
        display: grid;
        grid-template-columns: 90px auto 0;
        align-items: center;
        width: 100%;
        height: 60px;
        border: 1px solid var(--border);
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        transition: .3s;

        &__preview {
          width: 100%;
          aspect-ratio: 3 / 2;
          border-right: 1px solid var(--border);
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
          }
          &__description {
            font-size: 12px;
            padding-bottom: 5px;
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

        &--active {
          grid-template-columns: 90px auto 20px;
        }
      }
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
