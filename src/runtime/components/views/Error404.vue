<script setup lang="ts">
import type { ModuleClient } from '../../types';
import QuestionPageBlock from '../shared/QuestionPageBlock.vue';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const router = props.client.getRouter();

function goMain() {
  router.push('index', 'tab-fade-rl');
}
</script>

<template>
  <QuestionPageBlock
    page="Error404"
    class="TE-error-404"
    icon="I404"
    question-title="Page not found"
    first-btn-title="Go main"
    :first-on-click="goMain"
  />
</template>

<style lang="scss" scoped>
.TE-error-404 {}
</style>
