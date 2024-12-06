<script setup lang="ts">
import type { ModuleClient, ModuleThemeEditData } from '../../types';
import IsInput from '../shared/IsInput.vue';
import IsButton from '../shared/IsButton.vue';
import NotifyBlock from '../shared/NotifyBlock.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import ViewPage from '../widgets/ViewPage.vue';
import useErrorMessages from '../../helpers/client/useErrorMessages';
import { computed, reactive } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const themes = client.getThemes();

const activeErrors = useErrorMessages();
const themeEditData = reactive({} as ModuleThemeEditData);
const themeId = computed(() => router.getQuery().themeId);
const previewTheme = computed(() => ({
  id: themeId.value ?? 'default',
  name: themeEditData.name || themeEditData.id,
  meta: { description: themeEditData.description }
}) as any);

function editTheme() {
  const id = themeEditData.id;
  activeErrors.clear();

  if (!id.length) activeErrors.add(0);
  if (!/^[\w-]+$/.test(id)) activeErrors.add(1);
  if (themeId.value !== id && id in themes) activeErrors.add(2, { id });

  if (!activeErrors.isError.value) {
    client.editThemeInfo(themeEditData);
    router.push('index', 'tab-fade-rl');
  }
}

function onActivate() {
  if (!themeId.value || !client.getThemes()[themeId.value]) {
    router.push('index', 'tab-fade-lr');
    return;
  }

  const theme = client.getThemes()[themeId.value];
  activeErrors.clear();
  Object.assign(themeEditData, {
    id: theme.id,
    name: theme.name,
    description: theme.meta.description,
    oldThemeId: themeId.value
  });
}
</script>

<template>
  <ViewPage
    page-id="editThemeInfo"
    :client="client"
    @on-active:on="onActivate"
  >
    <div class="TE-theme-edit-info">
      <div class="TE-theme-edit-info__delimiter">
        Theme Info
      </div>
      <div class="TE-theme-edit-info__row">
        <IsInput
          id="id"
          v-model="themeEditData.id"
          title="ID"
          is-required-icon
          :max-length="30"
          @input="activeErrors.remove(0, 1, 2)"
        />
      </div>
      <div class="TE-theme-edit-info__row">
        <IsInput
          id="name"
          v-model="themeEditData.name"
          title="Name"
          :placeholder="themeEditData.id"
          :max-length="30"
        />
      </div>
      <div class="TE-theme-edit-info__row">
        <IsInput
          id="description"
          v-model="themeEditData.description"
          title="Description"
          :max-length="200"
        />
      </div>
      <div class="TE-theme-edit-info__delimiter">
        Preview Card
      </div>
      <div class="TE-theme-edit-info__row">
        <ThemeBlock :theme="previewTheme" />
      </div>
    </div>
    <template #messages>
      <div class="TE-theme-edit-info-messages">
        <transition-expand>
          <NotifyBlock
            v-if="activeErrors.isError.value"
            type="ERROR"
          >
            <template #title>
              Validation error
            </template>
            <transition-expand tag="div">
              <p
                v-for="error of activeErrors.errors"
                :key="error.id"
              >
                {{ error.message }}
              </p>
            </transition-expand>
          </NotifyBlock>
        </transition-expand>
      </div>
    </template>
    <template #footer>
      <div class="TE-theme-edit-info-footer">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Go back
        </IsButton>
        <IsButton
          decor="success"
          @click="editTheme"
        >
          Save
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.TE-theme-edit-info {
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
    display: flex;
    flex-direction: column;
    gap: 5px;
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
