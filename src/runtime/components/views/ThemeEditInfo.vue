<script setup lang="ts">
import type { ModuleClient, ModuleThemeEditData } from '../../types';
import IsInput from '../shared/IsInput.vue';
import IsButton from '../shared/IsButton.vue';
import NotifyBlock from '../shared/NotifyBlock.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import ViewPage from '../widgets/ViewPage.vue';
import useErrorMessages from '../../helpers/client/useErrorMessages';
import IsHr from '../shared/IsHr.vue';
import useLang from '../../helpers/client/useLang';
import { computed, onBeforeMount, reactive } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();

const activeErrors = useErrorMessages();
const themeId = computed(() => router.route.query.themeId);
const theme = computed(() => client.getThemeById(themeId.value)!);

const themeEditData = reactive({
  id: theme.value.id,
  name: theme.value.name === theme.value.id ? '' : theme.value.name,
  description: theme.value.description,
  oldThemeId: themeId.value
} as ModuleThemeEditData);
const previewTheme = computed(() => ({
  id: themeId.value ?? 'default',
  name: themeEditData.name || themeEditData.id,
  description: themeEditData.description
}) as any);

async function editTheme() {
  const id = themeEditData.id;
  activeErrors.clear();

  if (!id.length) activeErrors.add(0);
  if (!/^[\w-]+$/.test(id)) activeErrors.add(1);
  if (themeId.value !== id && client.getThemeById(id)) activeErrors.add(2, { id });

  if (!activeErrors.isError.value) {
    if (await theme.value.editInfo(themeEditData)) {
      router.push('index', 'tab-fade-rl');
    }
  }
}

onBeforeMount(() => {
  if (!themeId.value || !client.getThemeById(themeId.value)) {
    router.push('index', 'tab-fade-lr');
    return;
  }
});
</script>

<template>
  <ViewPage
    v-if="theme"
    page="editThemeInfo"
    :loader="theme.loader"
  >
    <div
      class="TE-theme-edit-info"
      @keyup.enter="editTheme"
    >
      <div class="TE-theme-edit-info__block">
        <IsHr>{{ useLang('pageCreateEdit.infoTitle') }}</IsHr>
        <div class="TE-theme-edit-info__block__row">
          <IsInput
            id="id"
            v-model="themeEditData.id"
            :is-disabled="theme.type === 'global'"
            :title="useLang('pageCreateEdit.inputId')"
            :max-length="30"
            is-required-icon
            @input="activeErrors.remove(0, 1, 2)"
          />
        </div>
        <div class="TE-theme-edit-info__block__row">
          <IsInput
            id="name"
            v-model="themeEditData.name"
            :title="useLang('pageCreateEdit.inputName')"
            :placeholder="themeEditData.id"
            :max-length="30"
          />
        </div>
        <div class="TE-theme-edit-info__block__row">
          <IsInput
            id="description"
            v-model="themeEditData.description"
            :title="useLang('pageCreateEdit.inputDescription')"
            :max-length="200"
          />
        </div>
      </div>
      <div class="TE-theme-edit-info__block">
        <IsHr>{{ useLang('pageCreateEdit.previewTitle') }}</IsHr>
        <div class="TE-theme-edit-info__block__row">
          <ThemeBlock :theme="previewTheme">
            <template #preview>
              <slot name="preview" />
            </template>
          </ThemeBlock>
        </div>
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
              {{ useLang('pageCreateEdit.messages.validationError') }}
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
          {{ useLang('pageCreateEdit.buttons.goBack') }}
        </IsButton>
        <IsButton
          decor="success"
          @click="editTheme"
        >
          {{ useLang('pageCreateEdit.buttons.save') }}
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.TE-theme-edit-info {
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
