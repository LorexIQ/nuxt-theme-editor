<script lang="ts" setup>
import { h } from 'vue';
import type {
  ModuleIcons,
  ModuleSandboxContextMenuItem,
  ModuleSandboxMousePosition,
  ModuleSandboxSize
} from '../../types';
import IconArrow from '../icons/IconArrow.vue';
import IconCheck from '../icons/IconCheck.vue';
import IconPlus from '../icons/IconPlus.vue';
import { computed, onMounted, ref } from '#imports';

type Props = {
  sandboxSize: ModuleSandboxSize;
  clickPosition: ModuleSandboxMousePosition;
  items: ModuleSandboxContextMenuItem[];
};
type Emits = {
  (e: 'close'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const sandboxSize = props.sandboxSize;

const menuRef = ref<HTMLDivElement>();
const menuBoundingRect = ref<DOMRect>();
const menuPosition = computed(() => {
  const menuRect = menuBoundingRect.value;
  const left = menuRect && menuRect.right > sandboxSize.width ? sandboxSize.width - menuRect.width : props.clickPosition.x;
  const top = menuRect && menuRect.bottom > sandboxSize.height ? sandboxSize.height - menuRect.height : props.clickPosition.y;

  return {
    left: left + 'px',
    top: top + 'px'
  };
});

function getIconByName(icon?: ModuleIcons) {
  switch (icon) {
    case 'Arrow':
      return IconArrow;
    case 'Check':
      return IconCheck;
    case 'Plus':
      return IconPlus;
    default:
      return h('template');
  }
}
function selectItem(item: ModuleSandboxContextMenuItem) {
  item.action();
  closeContextMenu();
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
    class="context-menu"
    @contextmenu.self.prevent="closeContextMenu"
    @click.self="closeContextMenu"
  >
    <div
      ref="menuRef"
      class="context-menu__menu"
      :style="menuPosition"
      @contextmenu.prevent
    >
      <div class="context-menu__menu__tip">
        Выберите действие
      </div>
      <div class="context-menu__menu__items">
        <div
          v-for="item of items"
          :key="item.title"
          class="context-menu__menu__items__item"
          :class="{
            'context-menu__menu__items__item--disabled': item.isDisabled?.(),
            'context-menu__menu__items__item--with-icon': item.icon,
          }"
          @click="selectItem(item)"
        >
          <div
            v-if="item.icon"
            class="context-menu__menu__items__item__icon"
            :style="`color: ${item.iconColor};`"
          >
            <component :is="getIconByName(item.icon)" />
          </div>
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(var(--blurGlass));
  background-color: var(--bgGlass);
  user-select: none;

  &__menu {
    position: absolute;
    width: max-content;
    border-radius: 5px;
    background-color: var(--bg);
    box-shadow: 0 0 10px var(--shadow);
    overflow: hidden;

    &__tip {
      font-size: 10px;
      padding: 2px 5px;
      color: var(--titleTransparent);
      border-bottom: 1px solid var(--border);
    }
    &__items {
      &__item {
        display: grid;
        grid-template-columns: auto;
        align-items: center;
        font-size: 14px;
        gap: 5px;
        padding: 2px 5px;
        color: var(--title);
        cursor: pointer;

        &:hover {
          background-color: var(--bgHover);
        }
        &__icon {
          display: flex;
          justify-content: center;
          align-items: center;

          & svg {
            font-size: 16px;
          }
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
  }
}
</style>
