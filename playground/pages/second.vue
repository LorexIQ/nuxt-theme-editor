<script setup lang="ts">
import useSwitch from '../../src/runtime/helpers/client/useSwitch';

const router = useRouter();
const themesEditor = useThemeEditor();
const isEditEnabled = useState('test-editing', () => true);
const loaderRef = useSwitch();
</script>

<template>
  <div class="page-second">
    <h4>PAGE: SECOND</h4>
    <button @click="router.push({ path: '/' })">
      Go Index Page
    </button>
    <p style="background-color: var(--bg)">
      Is using useThemeBlock('sidebar.test')
    </p>
    <test-blocks />
    <test-blocks decor="1" />
    <test-blocks decor="2" />
    <button
      style="position: absolute; top: 0; z-index: 4"
      @click="loaderRef[loaderRef.status ? 'hide' : 'show']()"
    >
      Loader [{{ loaderRef.status ? 'ON' : 'OFF' }}]
    </button>
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
    <div style="max-height: 700px; overflow-y: auto">
      <log-object
        :value="themesEditor.usesScopesProperties"
        :replaces="[
          'pathsCache',
          'component',
          'ctx',
          'config',
          'md5Cache',
          'preparedUIStyles',
          'styles',
          'themesPathsCache',
          'preparedStyles',
          'preparedPreviewStyles',
          'pages',
          'currentPage',
          'storageLocalThemes',
          'sandbox',
          'router',
        ]"
      />
    </div>
    <tabs>
      <tabs-tab
        key="1"
        with-frame
      >
        123
      </tabs-tab>
      <tabs-tab key="2">
        123
      </tabs-tab>
    </tabs>

    <loader v-model="loaderRef" />
  </div>
</template>

<style lang="scss" scoped>
.page-second {
  position: relative;
}
</style>
