<script setup lang="ts">
const router = useRouter();
const themesEditor = useThemesEditor();
const scopeStyles = useThemeBlock('sidebar.test');
console.log('second.vue useThemeBlock =>', scopeStyles.value);
</script>

<template>
  <div class="page-second">
    <h4>PAGE: SECOND</h4>
    {{ themesEditor.getStylesKeyValueByPath('sidebar.test.testtesttest') }}

    <input v-model="themesEditor.getSelectedTheme()!.target.styles.at(-1)!.styles.at(-1)!.styles[0].testtesttest">
    <input
      v-model="themesEditor.getSelectedTheme()!.target.styles[0].styles[0].dssssss3"
      type="color"
    >
    <input
      v-model="themesEditor.getSelectedTheme()!.target.styles[0].styles[0].test"
      type="color"
    >
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
    <log-object
      :value="themesEditor"
      :replaces="{ ctx: '[CTX]' }"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
