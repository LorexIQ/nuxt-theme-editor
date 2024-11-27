<script setup lang="ts">
import BlockThemes from '../widgets/BlockThemes.vue';
import type { Client } from '../../classes/Client';

type Props = {
  client: Client;
};
type Emits = {
  (e: 'onNewTheme', parentTheme?: string): void;
};

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="TE-themes-list">
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
</template>
