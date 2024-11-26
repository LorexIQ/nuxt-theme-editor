<script setup lang="ts">
import BlockThemes from '../features/BlockThemes.vue';
import type { Client } from '../../classes/Client';

type Props = {
  client: Client;
};

defineProps<Props>();
</script>

<template>
  <div class="TE-themes-list">
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
</template>
