<script setup lang="ts">
import BlockThemes from '../widgets/BlockThemes.vue';
import type { ModuleClient } from '../../types';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const router = props.client.getRouter();
</script>

<template>
  <transition :name="router.getTransitionName()">
    <div
      v-if="router.getPath() === 'index'"
      class="TE-themes-list"
    >
      <BlockThemes
        type="system"
        is-open
        :client="client"
      />
      <BlockThemes
        type="global"
        :client="client"
      />
      <BlockThemes
        type="local"
        :client="client"
      />
    </div>
  </transition>
</template>
