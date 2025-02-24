<script setup lang="ts">
import ResizeObserver from '../shared/ResizeObserver.vue';
import type { ModuleClientSandbox } from '../../types';
import { ref } from '#imports';

type Props = {
  sandbox: ModuleClientSandbox;
};

const props = defineProps<Props>();
const sandbox = props.sandbox;
const sandboxId = sandbox.getId();
const components = sandbox.getComponents();

const sandboxRef = ref<HTMLDivElement>();
</script>

<template>
  <transition-group
    :id="sandboxId"
    ref="sandboxRef"
    class="TE-sandbox"
    name="list"
    tag="div"
  >
    <template
      v-for="_component in components"
      :key="_component.id"
    >
      <component
        :is="_component.component"
        :id="`${sandboxId}:${_component.id}`"
        class="TE-sandbox__component"
        v-bind="{ ...(_component.props ?? {}), class: _component.transitionName }"
        v-on="_component.emits ?? {}"
      />
    </template>

    <ResizeObserver
      key="resize-observer"
      emit-on-mount
      @notify="sandbox.setBoxSize($event)"
    />
  </transition-group>
</template>

<style scoped lang="scss">
.TE-sandbox {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;

  &__component {
    z-index: 10;
    pointer-events: all;
  }
}

.fade.list {
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
