<script setup lang="ts">
const router = useRouter();
const themesEditor = useThemesEditor();
const scopeStyles = useThemeBlock('sidebar.test');
console.log('second.vue useThemeBlock =>', scopeStyles.value);
</script>

<template>
  <div class="page-second">
    <h4>PAGE: SECOND</h4>

    <button @click="router.push({ path: '/' })">
      Go Index Page
    </button>
    <p>Is using useThemeBlock('sidebar.test')</p>
    <div class="test-blocks">
      <div class="test-blocks__left" />
      <div class="test-blocks__right" />
    </div>
    <button @click="themesEditor.setTheme('light')">
      LIGHT
    </button>
    <button @click="themesEditor.setTheme('dark')">
      DARK
    </button>
    <button @click="themesEditor.setAutoThemeModeStatus(!themesEditor.getAutoThemeModeStatus())">
      AUTO [{{ themesEditor.getAutoThemeModeStatus() ? 'ON' : 'OFF' }}]
    </button>
  </div>
</template>

<style lang="scss" scoped>
</style>
