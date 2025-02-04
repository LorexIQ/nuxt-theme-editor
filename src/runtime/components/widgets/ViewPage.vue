<script lang="ts" setup>
import IconsStore from '../shared/IconsStore.vue';
import type { UseSwitchClass } from '../../helpers/client/useSwitch';
import ClientErrors from '../features/ClientErrors.vue';
import useClient from '../../helpers/client/useClient';
import type { ModulePagesNames } from '../../types';
import { ref } from '#imports';

type Props = {
  page: ModulePagesNames;
  loader?: UseSwitchClass;
};
type Emits = {
  (e: 'scrollend', v: Event): void;
};

defineProps<Props>();
const emit = defineEmits<Emits>();
const client = useClient();

const templateRef = ref<HTMLDivElement>();
const messagesRef = ref<HTMLDivElement>();
const footerRef = ref<HTMLDivElement>();

defineExpose({
  templateRef,
  messagesRef,
  footerRef
});
</script>

<template>
  <div class="TE-view-page">
    <transition name="fade">
      <div
        v-if="loader?.status"
        class="TE-view-page__loader"
      >
        <IconsStore
          icon="Spinner"
          size="40"
        />
      </div>
      <div
        v-else
        class="TE-view-page__content"
      >
        <div
          ref="templateRef"
          class="TE-view-page__content__template"
          @scrollend="emit('scrollend', $event)"
        >
          <slot />
        </div>
        <div
          ref="messagesRef"
          class="TE-view-page__content__messages"
        >
          <slot name="messages" />
          <ClientErrors
            :client="client"
            :page="page"
          />
        </div>
        <div
          ref="footerRef"
          class="TE-view-page__content__footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.TE-view-page {
  position: relative;
  height: 100%;

  &__loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    & svg {
      color: var(--titleTransparent)
    }
  }
  &__content {
    display: grid;
    grid-template-rows: 1fr auto auto;
    height: inherit;
    margin-left: -1px;
    border-left: 1px solid var(--border);

    &__template {
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__footer {
      background-color: var(--bgFooter);
      box-shadow: 0 0 10px var(--shadow);
    }
  }
}

.tab-fade-lr {
  &-enter-active, &-leave-active {
    position: absolute;
    width: 100%;
    transition: .3s;
  }
  &-leave-to {
    opacity: 0;
    transform: scaleX(.9) translateX(-100%);
  }
  &-enter-from {
    opacity: 0;
    transform: scaleX(.9) translateX(100%);
  }
}
.tab-fade-rl {
  &-enter-active, &-leave-active {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: .3s;
  }
  &-leave-to {
    opacity: 0;
    transform: scaleX(.9) translateX(100%);
  }
  &-enter-from {
    opacity: 0;
    transform: scaleX(.9) translateX(-100%);
  }
}
</style>
