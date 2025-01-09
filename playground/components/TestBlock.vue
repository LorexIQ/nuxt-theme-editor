<script setup lang="ts">
const componentStyles = useThemeBlock('navbar');
useThemeBlock('sidebar.test');
</script>

<template>
  <div class="test-block">
    {{ componentStyles }}
  </div>
</template>

<style scoped lang="scss">

</style>
