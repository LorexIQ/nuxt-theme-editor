<script setup lang="ts">
import Test from '~/components/Test.vue';

const router = useRouter();
const themesEditor = useThemeEditor();
const scopeStyles = useThemeBlock('sidebar.test');
const isEditEnabled = useState('test-editing', () => false);

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
    <button @click="themesEditor.setThemeSelectedAsMain('light')">
      LIGHT
    </button>
    <button @click="themesEditor.setThemeSelectedAsMain('dark')">
      DARK
    </button>
    <button @click="themesEditor.setAutoThemeModeStatus(!themesEditor.getAutoThemeModeStatus())">
      AUTO [{{ themesEditor.getAutoThemeModeStatus() ? 'ON' : 'OFF' }}]
    </button>
    <button @click="isEditEnabled = !isEditEnabled">
      Edit [{{ isEditEnabled ? 'ON' : 'OFF' }}]
    </button>
    <theme-editor-opener v-slot="{ status }">
      <button>
        Editor {{ status ? 'Close' : 'Open' }}
      </button>
    </theme-editor-opener>
    {{ scopeStyles }}
    <!--    <div style="max-height: 700px; overflow-y: auto"> -->
    <!--      <log-object -->
    <!--        :value="themesEditor" -->
    <!--        :replaces="[ -->
    <!--          'pathsCache', -->
    <!--          'component', -->
    <!--          'ctx', -->
    <!--          'config', -->
    <!--          'md5Cache', -->
    <!--          'preparedUIStyles', -->
    <!--          'styles', -->
    <!--          'themesPathsCache', -->
    <!--          'preparedStyles', -->
    <!--          'preparedPreviewStyles', -->
    <!--          'pages', -->
    <!--          'currentPage', -->
    <!--          'storageLocalThemes', -->
    <!--          'sandbox', -->
    <!--          'router', -->
    <!--        ]" -->
    <!--      /> -->
    <!--    </div> -->
    <Test />
    <Test />
    <Test />
    <Test />
    <Test />
  </div>
</template>

<style lang="scss" scoped>
</style>
