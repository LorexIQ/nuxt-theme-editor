<script setup lang="ts">
import type { ModuleClient, ModuleThemeRootReturn, ModuleThemeType } from '../../types';
import ThemeBlock from '../features/ThemeBlock.vue';
import ThemeBlockStatus from '../features/ThemeBlockStatus.vue';
import IconsStore from '../shared/IconsStore.vue';
import { ref, computed } from '#imports';

type Props = {
  type: ModuleThemeType;
  client: ModuleClient;
  isOpen?: boolean;
};
type Emits = {
  (e: 'contextMenuOpen', v: [MouseEvent, ModuleThemeRootReturn]): void;
};

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
});
const emit = defineEmits<Emits>();

const isOpened = ref(props.isOpen);
const isAddActive = computed(() => props.type === 'local');
const themes = computed(() => Object.values(props.client.getThemes()).filter(theme => theme.type === props.type));
const title = computed(() => {
  switch (props.type) {
    case 'system':
      return 'System';
    case 'global':
      return 'Global';
    case 'local':
      return 'Local';
    default:
      return 'Unsupported';
  }
});
</script>

<template>
  <div class="TE-block-themes">
    <div
      class="TE-block-themes__title"
      @click="isOpened = !isOpened"
    >
      {{ title }}
      <div
        class="TE-block-themes__title__icon"
        :class="{ 'TE-block-themes__title__icon--open': isOpened }"
      >
        <IconsStore icon="Arrow" />
      </div>
    </div>
    <transition-expand>
      <div
        v-if="isOpened"
        class="TE-block-themes__content"
      >
        <div
          v-if="isAddActive"
          class="TE-block-themes__content__add"
          @click="client.getRouter().push('newTheme', 'tab-fade-lr')"
        >
          <IconsStore icon="Plus" />
        </div>
        <div
          v-if="themes.length"
          class="TE-block-themes__content__themes"
        >
          <ThemeBlock
            v-for="theme of themes"
            :key="theme.id"
            :client="client"
            :theme="theme"
            @dblclick="client.setTheme(theme.id)"
            @contextmenu.prevent="emit('contextMenuOpen', [$event, theme])"
          >
            <template #status>
              <ThemeBlockStatus
                :client="client"
                :theme="theme"
              />
            </template>
          </ThemeBlock>
        </div>
        <div
          v-else
          class="TE-block-themes__content__null"
        >
          No themes available
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<style scoped lang="scss">
.TE-block-themes {
  &__title {
    position: sticky;
    top: 0;
    z-index: 1;
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
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid var(--border);

    &__add {
      display: flex;
      justify-content: center;
      padding: 5px;
      color: var(--title);
      border: 1px solid var(--border);
      border-radius: 5px;
      cursor: pointer;
      transition: .3s;

      & svg {
        font-size: 30px;
      }

      &:hover {
        background-color: var(--bgHover);
      }
    }
    &__themes {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    &__null {
      font-size: 12px;
      color: var(--titleTransparent);
      text-align: center;
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
