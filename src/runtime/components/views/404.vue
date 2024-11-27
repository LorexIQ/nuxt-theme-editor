<script setup lang="ts">
import type { Client } from '../../classes/Client';

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
      class="TE-404"
    >
      404
    </div>
  </transition>
</template>
