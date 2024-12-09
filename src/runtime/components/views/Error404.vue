<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const router = props.client.getRouter();
</script>

<template>
  <ViewPage>
    <h1>404</h1>
    <span>Страница не найдена</span>
    <IsButton @click="router.push('index', 'tab-fade-rl')">
      Назад
    </IsButton>
  </ViewPage>
</template>

<style lang="scss" scoped>
.TE-error-404 {
  justify-content: center;
  align-items: center;

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
