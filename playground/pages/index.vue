<script setup lang="ts">
const router = useRouter();
const themesEditor = useThemesEditor();
</script>

<template>
  <div class="page-index">
    <h4>PAGE: INDEX</h4>
    <button @click="router.push({ path: '/second' })">
      Go Second Page
    </button>
    <p>Use global styles. Right block is null</p>
    <div class="test-blocks">
      <div class="test-blocks__left" />
      <div class="test-blocks__right" />
    </div>
    <button @click="themesEditor.setThemeSelectedAsMain('light')">
      LIGHT
    </button>
    <button @click="themesEditor.setThemeSelectedAsMain('dark')">
      DARK
    </button>
  </div>
</template>

<style scoped>
*[asd] {
  background-color: var(--testtesttest);
}
</style>
