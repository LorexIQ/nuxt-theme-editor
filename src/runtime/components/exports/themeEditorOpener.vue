<script setup lang="ts">
import useThemesEditor from '../../composables/useThemesEditor';
import { computed } from '#imports';

const client = useThemesEditor();
const isBlockVisible = computed(() => client.getBlockStatus());

function onClick() {
  client.setBlockStatus(!client.getBlockStatus());
}
</script>

<template>
  <div
    class="TE-opener"
    @click="onClick"
  >
    <slot :status="isBlockVisible" />
  </div>
</template>

<style scoped lang="scss">
.TE-opener {
}
</style>
