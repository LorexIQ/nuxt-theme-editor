<script setup lang="ts">
import type { Client } from '../../classes/Client';
import IsButton from '../shared/IsButton.vue';

type Props = {
  client: Client;
};

const props = defineProps<Props>();
const router = props.client.getRouter();
</script>

<template>
  <transition :name="router.getTransitionName()">
    <div
      v-if="router.getPath() === '404'"
      class="TE-error-404"
    >
      <h1>404</h1>
      <span>Страница не найдена</span>
      <IsButton @click="router.push('index', 'tab-fade-rl')">
        Назад
      </IsButton>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.TE-error-404 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  & h1 {
    font-family: 'Segoe Print', sans-serif;
    font-weight: 600;
    font-size: 70px;
    line-height: 80px;
    color: var(--title);
  }
  & span {
    font-size: 14px;
    font-weight: 600;
    color: var(--title);
  }
  & .TE-is-button {
    margin-top: 10px;
  }
}
</style>
