<script setup lang="ts">
import type { ModuleClient, ModuleThemeCreateData } from '../../types';
import IsInput from '../shared/IsInput.vue';
import IsButton from '../shared/IsButton.vue';
import NotifyBlock from '../shared/NotifyBlock.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IsHr from '../shared/IsHr.vue';
import BlockRadioThemes from '../widgets/BlockRadioThemes.vue';
import useErrorMessages from '../../helpers/client/useErrorMessages';
import useIdProtect from '../../helpers/useIdProtect';
import { computed, onBeforeMount, reactive } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();

const activeErrors = useErrorMessages();
const themeCreateData = reactive<ModuleThemeCreateData>({
  id: '',
  name: '',
  description: '',
  parentThemeId: router.route.query.parentThemeId
});
const previewTheme = computed<any>(() => ({
  id: themeCreateData.parentThemeId ?? useIdProtect('default'),
  name: themeCreateData.name || themeCreateData.id,
  description: themeCreateData.description
}));

function createTheme() {
  const id = themeCreateData.id;
  activeErrors.clear();

  if (!id.length) activeErrors.add(0);
  if (!/^[\w-]+$/.test(id)) activeErrors.add(1);
  if (client.getThemeById(id)) activeErrors.add(2, { id });
  if (!themeCreateData.parentThemeId) activeErrors.add(3);

  if (!activeErrors.isError.value) {
    client.createTheme(themeCreateData);
    router.push('index', 'tab-fade-rl');
  }
}

onBeforeMount(() => {});
</script>

<template>
  <ViewPage page="newTheme">
    <div
      class="TE-theme-create"
      @keyup.enter="createTheme"
    >
      <div class="TE-theme-create__block">
        <IsHr>Theme Info</IsHr>
        <div class="TE-theme-create__block__row">
          <IsInput
            id="id"
            v-model="themeCreateData.id"
            title="ID"
            is-required-icon
            :max-length="30"
            @input="activeErrors.remove(0, 1, 2)"
          />
        </div>
        <div class="TE-theme-create__block__row">
          <IsInput
            id="name"
            v-model="themeCreateData.name"
            title="Name"
            :placeholder="themeCreateData.id"
            :max-length="30"
          />
        </div>
        <div class="TE-theme-create__block__row">
          <IsInput
            id="description"
            v-model="themeCreateData.description"
            title="Description"
            :max-length="200"
          />
        </div>
      </div>
      <div class="TE-theme-create__block">
        <IsHr>Preview Card</IsHr>
        <div class="TE-theme-create__block__row">
          <ThemeBlock :theme="previewTheme">
            <template #preview>
              <slot name="preview" />
            </template>
          </ThemeBlock>
        </div>
      </div>
      <div class="TE-theme-create__block">
        <IsHr>Parent Theme</IsHr>
        <div class="TE-theme-create__block__row TE-theme-create__block__row--parent-theme">
          <BlockRadioThemes
            v-model="themeCreateData.parentThemeId"
            :client="client"
            @update:model-value="activeErrors.remove(3)"
          />
        </div>
      </div>
    </div>
    <template #messages>
      <div class="TE-theme-create-messages">
        <NotifyBlock type="INFO">
          <template #title>
            Information
          </template>
          You can customize all styles, including preview card and theme editor, after creating the theme.
        </NotifyBlock>
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
      <div class="TE-theme-create-footer">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Go back
        </IsButton>
        <IsButton
          decor="success"
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
  &__block {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 10px;

    &__row {
      padding: 0 10px;

      & > .TE-theme-block {
        cursor: default;
      }
      &--parent-theme {
        height: 100%;
      }
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
