<script setup lang="ts">
import NotifyBlock from '../shared/NotifyBlock.vue';
import type { ModuleClient, ModuleErrorType, ModulePagesNames } from '../../types';

type Props = {
  client: ModuleClient;
  type?: ModuleErrorType;
  page?: ModulePagesNames;
};

defineProps<Props>();
</script>

<template>
  <transition-expand
    class="TE-client-errors"
    tag="div"
  >
    <NotifyBlock
      v-for="message of client.getErrors(type, page)"
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
</template>

<style scoped lang="scss">
.TE-client-errors {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
