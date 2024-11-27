<script setup lang="ts">
import type { ModuleIcons } from '../../types';
import iconsConnector from '../../assets/iconsConnector';
import { computed } from '#imports';

type Props = {
  icon: ModuleIcons;
  size?: string;
};

const props = defineProps<Props>();
const icon = computed(() => iconsConnector[props.icon]);
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    :style="{
      fontSize: size,
    }"
  />
  <div v-else>
    err
  </div>
</template>
