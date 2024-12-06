<script setup lang="ts">
import NotifyBlock from '../shared/NotifyBlock.vue';
import type { ModuleClient, ModuleErrorType, ModulePagesNames } from '../../types';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
  type?: ModuleErrorType;
  page?: ModulePagesNames;
};

const props = defineProps<Props>();
const errors = computed(() => props.client.getErrors(props.type, props.page));
</script>

<template>
  <transition-expand>
    <transition-expand
      v-if="errors.length"
      class="TE-client-errors"
      tag="div"
    >
      <NotifyBlock
        v-for="message of errors"
        :key="message.id"
        :type="message.type"
        with-close
        @on-close="client.deleteError(message.id)"
      >
        <template #title>
          {{ message.title }}
        </template>
        {{ message.message }}
      </NotifyBlock>
    </transition-expand>
  </transition-expand>
</template>

<style scoped lang="scss">
.TE-client-errors {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}
</style>
