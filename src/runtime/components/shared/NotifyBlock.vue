<script setup lang="ts">
import type { ModuleIcons } from '../../types';
import IconsStore from './IconsStore.vue';
import { computed, getCurrentInstance } from '#imports';

type TypeGeneratorBase = {
  [name: string]: {
    defTitle: string;
    titleColor: string;
    contentColor: string;
    bgColor: string;
    icon: ModuleIcons;
  };
};
type BlockTypesIds = keyof typeof blockTypes;

type Props = {
  type: BlockTypesIds;
  withClose?: boolean;
};
type Emits = {
  (e: 'onClose'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const currentInstance = getCurrentInstance();

const typesGenerator = <T extends TypeGeneratorBase>(types: T) => types;
const blockTypes = typesGenerator({
  INFO: { defTitle: 'INFO', titleColor: 'var(--messageInfoTitle)', contentColor: 'var(--messageInfoContent)', bgColor: 'var(--messageInfoBg)', icon: 'Info' },
  TIP: { defTitle: 'TIP', titleColor: 'var(--messageTipTitle)', contentColor: 'var(--messageTipContent)', bgColor: 'var(--messageTipBg)', icon: 'Tip' },
  WARN: { defTitle: 'WARN', titleColor: 'var(--messageWarnTitle)', contentColor: 'var(--messageWarnContent)', bgColor: 'var(--messageWarnBg)', icon: 'Warn' },
  ERROR: { defTitle: 'ERROR', titleColor: 'var(--messageErrorTitle)', contentColor: 'var(--messageErrorContent)', bgColor: 'var(--messageErrorBg)', icon: 'Error' }
});

const selectedType = computed(() => blockTypes[props.type]);
const isContent = computed(() => currentInstance?.slots.default);
</script>

<template>
  <div
    class="TE-notify-block"
    :style="{ backgroundColor: selectedType.bgColor }"
  >
    <div
      class="TE-notify-block__header"
      :style="{ color: selectedType.titleColor }"
    >
      <div class="TE-notify-block__header__icon">
        <IconsStore
          :icon="selectedType.icon"
          size="100%"
        />
      </div>
      <div
        v-if="withClose"
        class="TE-notify-block__header__close"
        @click="emit('onClose')"
      >
        <IconsStore icon="Times" />
      </div>
      <div class="TE-notify-block__header__title">
        <slot name="title">
          {{ selectedType.defTitle }}
        </slot>
      </div>
    </div>
    <div
      v-if="isContent"
      class="TE-notify-block__content"
      :style="{ color: selectedType.contentColor }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.TE-notify-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  border-radius: 5px;

  & > div {
    font-size: 14px;
    line-height: 16px;
  }
  &__header {
    font-weight: 600;

    &__icon {
      float: left;
      width: 22px;
      height: 22px;
      margin-right: 5px;
    }
    &__close {
      float: right;
      width: 22px;
      height: 22px;
      margin-left: 5px;
      cursor: pointer;
      transition: .3s;

      &:hover {
        opacity: .7;
      }
    }
    &__title {
      padding-top: 4px;
    }
    &__content {
      white-space: pre-line;
    }
  }}
</style>
