<script setup lang="ts">
import type { ModuleClient, ModuleTheme, ModuleThemeType } from '../../types';
import ThemeBlock from '../features/ThemeBlock.vue';
import ThemeBlockStatus from '../features/ThemeBlockStatus.vue';
import IconsStore from '../shared/IconsStore.vue';
import DropDownBlock from '../shared/DropDownBlock.vue';
import useLang from '../../helpers/useLang';
import { computed } from '#imports';

type Props = {
  type: ModuleThemeType;
  client: ModuleClient;
  expandAction?: () => any;
};
type Emits = {
  (e: 'doubleClick', v: [MouseEvent, ModuleTheme]): void;
  (e: 'contextMenuOpen', v: [MouseEvent, ModuleTheme]): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isAddActive = computed(() => props.type === 'local');
const themes = computed(() => Object.values(props.client.getThemes()).filter(theme => theme.type === props.type).sort((a, b) => a.name.localeCompare(b.name)));
const typeUpper = computed(() => `${props.type[0].toUpperCase()}${props.type.slice(1)}`);
const expandStatus = computed(() => (props.client as any)[`getThemesBlock${typeUpper.value}Status`]());
const blockTitle = computed(() => {
  switch (props.type) {
    case 'system':
      return useLang('pageIndex.blockSystemTitle');
    case 'global':
      return useLang('pageIndex.blockGlobalTitle');
    case 'local':
      return useLang('pageIndex.blockLocalTitle');
    default:
      return useLang('global.unknown');
  }
});

function onChangeStatus(status: boolean) {
  (props.client as any)[`setThemesBlock${typeUpper.value}Status`](Number(status));
}
</script>

<template>
  <DropDownBlock
    class="TE-block-themes"
    expand-enabled
    :expand-default="!!expandStatus"
    :expand-action="expandAction"
    :expand-is-init="expandStatus === 1"
    @change-status="onChangeStatus"
  >
    <template #title>
      {{ blockTitle }}
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
              @dblclick="emit('doubleClick', [$event, theme])"
              @contextmenu.prevent="emit('contextMenuOpen', [$event, theme])"
            >
              <template #preview>
                <slot name="preview" />
              </template>
              <template #status>
                <ThemeBlockStatus :theme="theme" />
              </template>
            </ThemeBlock>
          </div>
          <div
            v-else
            class="TE-block-themes__content__null"
          >
            {{ useLang('pageIndex.themesEmpty') }}
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
