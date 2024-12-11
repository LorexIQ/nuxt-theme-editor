<script setup lang="ts">
import Pipette from './icons/Pipette.vue';
import Loader from './icons/Loader.vue';

const isDropperOpen = ref(false);

function openDropper() {
  isDropperOpen.value = true;
}
</script>

<template>
  <div class="color-picker-eye-dropper">
    <Loader v-if="isDropperOpen" />
    <Pipette
      v-else
      class="color-picker-eye-dropper__pipette"
      @click="openDropper"
    />
  </div>
</template>

<style scoped lang="scss">
.color-picker-eye-dropper {
  width: 38px;
  border-radius: 2px;
  color: #9099a4;
  background: #eceef0;
  box-shadow:  0 0 1px 0.5px rgba(0, 0, 0, 0.2) inset;
  cursor: pointer;
  transition: .3s;
  overflow: hidden;
}
</style>
