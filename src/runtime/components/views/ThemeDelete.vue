<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IconsStore from '../shared/IconsStore.vue';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const themeId = computed(() => router.getQuery().themeId);

function onThemeDelete() {
  client.deleteTheme(themeId.value);
  router.push('index', 'tab-fade-rl');
}
function onActivate() {
  if (!themeId.value || !client.getThemes()[themeId.value]) {
    router.push('index', 'tab-fade-lr');
  }
}
</script>

<template>
  <ViewPage
    page-id="deleteTheme"
    :client="client"
    @on-active:on="onActivate"
  >
    <div class="TE-theme-delete">
      <IconsStore
        icon="Question"
        size="80px"
      />

      <span>Are you sure you want to delete the theme</span>
      <div class="TE-theme-delete__actions">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Cancel
        </IsButton>
        <IsButton
          decor="error"
          @click="onThemeDelete"
        >
          Delete
        </IsButton>
      </div>
    </div>
  </ViewPage>
</template>

<style lang="scss" scoped>
.TE-theme-delete {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: 100%;
  text-align: center;

  & h1 {
    font-family: 'Segoe Print', sans-serif;
    font-weight: 600;
    font-size: 70px;
    line-height: 80px;
    color: var(--title);
  }
  & span {
    font-size: 14px;
    font-weight: 600;
    color: var(--title);
  }
  & .TE-is-button {
    margin-top: 10px;
  }

  &__actions {
    display: flex;
    gap: 5px;
  }
}
</style>
