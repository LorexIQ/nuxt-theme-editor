<script setup lang="ts">
import type { ModuleClient, ModuleThemeCreateData } from '../../types';
import IsInput from '../shared/IsInput.vue';
import IsButton from '../shared/IsButton.vue';
import NotifyBlock from '../shared/NotifyBlock.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import ViewPage from '../widgets/ViewPage.vue';
import BlockRadioThemes from '../widgets/BlockRadioThemes.vue';
import { computed, reactive } from '#imports';

type ValidationError = {
  id: number;
  message: (meta: any) => string;
};
type ValidationErrorPrepared = {
  id: number;
  message: string;
};

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const themes = client.getThemes();

const validationErrors: ValidationError[] = [
  { id: 0, message: () => 'The ID value is required.' },
  { id: 1, message: () => 'The ID may only contain digits and letters (a-z, A-Z).' },
  { id: 2, message: ({ id }) => `The theme with the ID "${id}" already exists.` },
  { id: 3, message: () => 'The parent theme is not set.' }
];

const activeValidationErrors = reactive<ValidationErrorPrepared[]>([]);
const themeCreateData = reactive({} as ModuleThemeCreateData);
const previewTheme = computed(() => ({
  id: themeCreateData.parentThemeId ?? 'default',
  name: themeCreateData.name || themeCreateData.id,
  meta: { description: themeCreateData.description }
}) as any);

function createTheme() {
  const id = themeCreateData.id;
  activeValidationErrors.splice(0);

  if (!id.length) addError(0);
  if (!/^[a-z0-9]+$/i.test(id)) addError(1);
  if (id in themes) addError(2, id);
  if (!themeCreateData.parentThemeId) addError(3);

  if (!activeValidationErrors.length) {
    client.createTheme(themeCreateData);
    router.push('index', 'tab-fade-rl');
  }
}
function addError(id: number, meta?: any) {
  const error = validationErrors.find(err => err.id === id);
  if (error) activeValidationErrors.push({
    id: error.id,
    message: error.message(meta)
  });
}
function removeError(id: number) {
  const errorIndex = activeValidationErrors.findIndex(err => err.id === id);
  if (errorIndex !== -1) activeValidationErrors.splice(errorIndex, 1);
}

function onActivate() {
  activeValidationErrors.splice(0);
  Object.assign(themeCreateData, {
    id: '',
    name: '',
    description: '',
    parentThemeId: router.getQuery()['parentThemeId']
  });
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
          :max-length="30"
          @input="removeError(0); removeError(1); removeError(2)"
        />
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="name"
          v-model="themeCreateData.name"
          title="Name"
          :placeholder="themeCreateData.id"
          :max-length="30"
        />
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="description"
          v-model="themeCreateData.description"
          title="Description"
          :max-length="200"
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
          @update:model-value="removeError(3)"
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
        <transition-expand>
          <NotifyBlock
            v-if="activeValidationErrors.length"
            type="error"
          >
            <template #title>
              Validation error
            </template>
            <transition-expand tag="div">
              <p
                v-for="error of activeValidationErrors"
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
      <div class="TE-theme-create-footer">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Go back
        </IsButton>
        <IsButton
          decor="green"
          @click="createTheme"
        >
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
