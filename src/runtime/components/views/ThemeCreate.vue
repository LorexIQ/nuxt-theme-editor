<script setup lang="ts">
import type { ModuleClient } from '../../types';
import IsInput from '../shared/IsInput.vue';
import IsButton from '../shared/IsButton.vue';
import NotifyBlock from '../shared/NotifyBlock.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import ViewPage from '../widgets/ViewPage.vue';
import BlockRadioThemes from '../widgets/BlockRadioThemes.vue';
import { computed, reactive } from '#imports';

type ThemeCreateData = {
  id: string;
  name: string;
  description: string;
  parentThemeId?: string;
};

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();

const themeCreateData = reactive({} as ThemeCreateData);
const previewTheme = computed(() => ({
  id: themeCreateData.parentThemeId ?? 'default',
  name: themeCreateData.name || themeCreateData.id,
  meta: { description: themeCreateData.description }
}) as any);

function onActivate() {
  Object.assign(themeCreateData, {
    id: '',
    name: '',
    description: '',
    parentThemeId: router.getQuery()['parentThemeId']
  });
}
function createTheme() {

}
</script>

<template>
  <ViewPage
    page-id="newTheme"
    :client="client"
    @on-active:on="onActivate"
  >
    <div class="TE-theme-create">
      <div class="TE-theme-create__delimiter">
        Theme Info
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="id"
          v-model="themeCreateData.id"
          title="ID"
          is-required-icon
          :max-length="20"
        />
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="name"
          v-model="themeCreateData.name"
          title="Name"
          :placeholder="themeCreateData.id"
        />
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="description"
          v-model="themeCreateData.description"
          title="Description"
        />
      </div>
      <div class="TE-theme-create__delimiter">
        Preview Card
      </div>
      <div class="TE-theme-create__row">
        <ThemeBlock :theme="previewTheme" />
      </div>
      <div class="TE-theme-create__delimiter">
        Parent Theme
      </div>
      <div class="TE-theme-create__row TE-theme-create__row--parent-theme">
        <BlockRadioThemes
          v-model="themeCreateData.parentThemeId"
          :client="client"
        />
      </div>
    </div>
    <template #messages>
      <div class="TE-theme-create-messages">
        <NotifyBlock type="info">
          <template #title>
            Information
          </template>
          You can customize all styles, including preview card and theme editor, after creating the theme.
        </NotifyBlock>
      </div>
    </template>
    <template #footer>
      <div class="TE-theme-create-footer">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Go back
        </IsButton>
        <IsButton @click="createTheme">
          Create
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.TE-theme-create {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__delimiter {
    position: sticky;
    top: 0;
    z-index: 2;
    text-align: center;
    padding: 7px 0 5px;
    border-bottom: 1px solid var(--border);
    color: var(--title);
    background-color: var(--bg);
    box-shadow: 0 0 10px var(--bg);
  }
  &__row {
    padding: 0 10px;

    & > .TE-theme-block {
      cursor: default;
    }
    &--parent-theme {
      height: 100%;
    }
  }

  &-messages {
    padding: 10px;
    box-shadow: 0 0 10px var(--bg);
  }
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    padding: 10px;
  }
}
</style>
