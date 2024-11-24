<script setup lang="ts">
import type { Client } from '../../classes/Client';

type Props = {
  client: Client;
};

const props = defineProps<Props>();
const client = props.client;
const sandboxId = client.getConfig().keys.sandbox;
const components = client.getSandboxComponents();
</script>

<template>
  <transition-group
    :id="sandboxId"
    name="list"
    tag="div"
  >
    <component
      :is="_component.component"
      v-for="_component in components"
      :id="`${sandboxId}:${_component.id}`"
      :key="_component.id"
      v-bind="{ ...(_component.props ?? {}), class: _component.transitionName }"
      v-on="_component.emits ?? {}"
    />
  </transition-group>
</template>

<style scoped lang="scss">
div {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;

  & > * {
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
