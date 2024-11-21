<script setup lang="ts">
const themesEditor = useThemesEditor();
useThemeBlock('sidebar.test');
</script>

<template>
  <div class="page-index">
    <div />
    <button @click="themesEditor.selectTheme('light')">
      LIGHT
    </button>
    <button @click="themesEditor.selectTheme('dark')">
      DARK
    </button>
  </div>
</template>

<style scoped>
.page-index > div {
  width: 100px;
  height: 100px;
  background-color: var(--test);
}
</style>
