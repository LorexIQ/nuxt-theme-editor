<script setup lang="ts">
const router = useRouter();
const themesEditor = useThemesEditor();
useThemeBlock('sidebar.test');
</script>

<template>
  <div class="page-second">
    <h4>PAGE: SECOND</h4>
    {{ themesEditor.getSelectedThemeId() }}
    <button @click="router.push({ path: '/' })">
      Go Index Page
    </button>
    <p>Is using useThemeBlock('sidebar.test')</p>
    <div class="test-blocks">
      <div class="test-blocks__left" />
      <div class="test-blocks__right" />
    </div>
    <button @click="themesEditor.selectTheme('light')">
      LIGHT
    </button>
    <button @click="themesEditor.selectTheme('dark')">
      DARK
    </button>
    <button @click="themesEditor.setAutoModeTheme(!themesEditor.getAutoModeStatus())">
      AUTO [{{ themesEditor.getAutoModeStatus() ? 'ON' : 'OFF' }}]
    </button>
    <log-object
      :value="themesEditor"
      :replaces="{ ctx: '[CTX]' }"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
