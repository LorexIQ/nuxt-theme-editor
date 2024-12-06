<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import { computed } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();

const themeId = computed(() => router.getQuery().themeId);
const selectedTheme = computed(() => client.getSelectedTheme()!);

function onActivate() {
  if (!themeId.value || !client.getThemes()[themeId.value]) {
    router.push('index', 'tab-fade-lr');
    return;
  }

  client.setEditedTheme(themeId.value);
}
function goBack() {
  client.setEditedTheme(undefined);
  router.push('index', 'tab-fade-rl');
}
</script>

<template>
  <ViewPage
    page-id="editThemeStyles"
    :client="client"
    @on-active:on="onActivate"
  >
    <div class="TE-theme-edit-styles">
      <div class="TE-theme-edit-styles__all" />
    </div>
    <template #footer>
      <div class="TE-theme-edit-styles-footer">
        <IsButton @click="goBack">
          Go back
        </IsButton>
        <IsButton decor="success">
          Save
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.TE-theme-edit-styles {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    padding: 10px;
  }
}
</style>
