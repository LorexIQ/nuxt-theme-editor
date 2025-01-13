<script setup lang="ts">
import type { ModuleClient, ModuleThemeRootReturn, ModuleThemeType } from '../../types';
import ThemeBlock from '../features/ThemeBlock.vue';
import ThemeBlockStatus from '../features/ThemeBlockStatus.vue';
import IconsStore from '../shared/IconsStore.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import { computed } from '#imports';

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
  <DropDownBlock
    class="TE-block-themes"
    expand-enabled
    :expand-default="isOpen"
  >
    <template #title>
      {{ title }}
    </template>
    <template #default>
      <transition-expand>
        <div class="TE-block-themes__content">
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
    </template>
  </DropDownBlock>
</template>

<style scoped lang="scss">
.TE-block-themes {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;

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
</style>
