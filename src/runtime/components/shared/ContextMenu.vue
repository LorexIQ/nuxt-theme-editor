<script lang="ts" setup>
import type {
  ModuleSandboxContextMenuItem,
  ModuleSandboxMousePosition,
  ModuleSandboxSize
} from '../../types';
import IconsStore from '../shared/IconsStore.vue';
import TextRunner from './TextRunner.vue';
import IsInput from './IsInput.vue';
import { computed, onMounted, ref } from '#imports';

type Props = {
  sandboxSize: ModuleSandboxSize;
  clickPosition: ModuleSandboxMousePosition;
  items: ModuleSandboxContextMenuItem[];
  searchEnabled?: boolean;
  emptyText?: string;
  searchText?: string;
  tipText?: string;
  blurBg?: boolean;
  maxWidth?: string;
  maxHeight?: string;
};
type Emits = {
  (e: 'close'): void;
};

const props = withDefaults(defineProps<Props>(), {
  searchEnabled: false,
  blurBg: true,
  maxWidth: '100%',
  maxHeight: '100%'
});
const emit = defineEmits<Emits>();
const sandboxSize = props.sandboxSize;
const padding = 5;

const searchRef = ref('');
const menuRef = ref<HTMLDivElement>();
const menuBoundingRect = ref<DOMRect>();
const menuPosition = computed(() => {
  const menuRect = menuBoundingRect.value;
  const left = menuRect && menuRect.right > sandboxSize.width ? sandboxSize.width - menuRect.width - padding : props.clickPosition.x < padding ? padding : props.clickPosition.x;
  const top = menuRect && menuRect.bottom > sandboxSize.height ? sandboxSize.height - menuRect.height - padding : props.clickPosition.y < padding ? padding : props.clickPosition.y;

  return {
    left: left + 'px',
    top: top + 'px',
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight
  };
});
const filteredItems = computed(() => props.items.filter(item => item.title.toLowerCase().includes(searchRef.value.toLowerCase())));

function selectItem(event: MouseEvent, item: ModuleSandboxContextMenuItem) {
  closeContextMenu();
  item.action(event);
}
function closeContextMenu() {
  emit('close');
}

onMounted(() => {
  if (menuRef.value) {
    menuBoundingRect.value = menuRef.value.getBoundingClientRect();
  }
});
</script>

<template>
  <div
    class="TE-context-menu"
    :class="{ 'TE-context-menu--blur-bg': blurBg }"
    @contextmenu.self.prevent="closeContextMenu"
    @click.self="closeContextMenu"
  >
    <div
      ref="menuRef"
      class="TE-context-menu__menu"
      :style="menuPosition"
      @contextmenu.prevent
    >
      <div
        v-if="tipText"
        class="TE-context-menu__menu__tip"
      >
        {{ tipText }}
      </div>
      <div
        v-if="searchEnabled"
        class="TE-context-menu__menu__search"
      >
        <IsInput
          id="search"
          v-model="searchRef"
          :placeholder="searchText"
          post-icon="Times"
          :post-icon-visible="value => !!value.length"
          @click:post-icon="searchRef = ''"
        />
      </div>
      <div
        v-if="filteredItems.length"
        class="TE-context-menu__menu__items"
      >
        <template
          v-for="item of filteredItems"
          :key="item.title"
        >
          <div
            v-if="item.isVisible?.() ?? true"
            class="TE-context-menu__menu__items__item"
            :class="{
              'TE-context-menu__menu__items__item--disabled': item.isDisabled?.(),
              'TE-context-menu__menu__items__item--with-icon': item.icon,
            }"
            @click="selectItem($event, item)"
          >
            <div
              v-if="item.icon"
              class="TE-context-menu__menu__items__item__icon"
              :style="`color: ${item.iconColor};`"
            >
              <IconsStore :icon="item.icon" />
            </div>
            <div
              class="TE-context-menu__menu__items__item__title"
              :style="`color: ${item.titleColor};`"
            >
              <TextRunner>{{ item.title }}</TextRunner>
            </div>
          </div>
        </template>
      </div>
      <div
        v-else
        class="TE-context-menu__menu__empty"
      >
        {{ emptyText }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.TE-context-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  user-select: none;

  &__menu {
    position: absolute;
    display: grid;
    grid-template-rows: auto 1fr;
    width: max-content;
    border-radius: 5px;
    background-color: var(--contextMenuBg);
    box-shadow: 0 0 10px var(--shadow);
    overflow: hidden;

    &__tip {
      font-size: 10px;
      padding: 2px 5px;
      color: var(--titleTransparent);
      border-bottom: 1px solid var(--border);
    }
    &__search {
      padding: 5px;

      &:deep(.TE-is-input__input) {
        font-size: 12px;
        border-color: var(--border);
      }
      &:deep(.TE-is-input__post-icon svg) {
        width: 20px;
        height: 20px;
      }
    }
    &__items {
      height: 100%;
      overflow-y: auto;

      &__item {
        display: grid;
        grid-template-columns: auto;
        align-items: center;
        font-size: 14px;
        gap: 6px;
        padding: 3px 10px 3px 8px;
        color: var(--title);
        cursor: pointer;

        &:hover {
          background-color: var(--bgHover);
        }
        &__icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 16px;
          height: 16px;
          color: var(--contextMenuIcon);

          & svg {
            width: 100%;
            height: 100%;
          }
        }
        &__title {
          width: 100%;
          overflow: hidden;
        }

        &--disabled {
          pointer-events: none;
          opacity: .5;
        }
        &--with-icon {
          grid-template-columns: 16px auto;
        }
      }
    }
    &__empty {
      font-size: 14px;
      text-align: center;
      padding: 5px;
      color: var(--titleTransparent);
    }
  }

  &--blur-bg {
    backdrop-filter: blur(3px);
    background-color: var(--bgGlass);
  }
}
</style>
