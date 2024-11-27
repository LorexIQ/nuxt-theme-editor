<script setup lang="ts">
import BlockThemes from '../widgets/BlockThemes.vue';
import type { Client } from '../../classes/Client';

type Props = {
  client: Client;
};
type Emits = {
  (e: 'onNewTheme', parentTheme?: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
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
        @on-new-theme="emit('onNewTheme', $event)"
      />
      <BlockThemes
        type="global"
        :client="client"
        @on-new-theme="emit('onNewTheme', $event)"
      />
      <BlockThemes
        type="local"
        :client="client"
        @on-new-theme="emit('onNewTheme', $event)"
      />
    </div>
  </transition>
</template>
