<script setup lang="ts">
import type { ModuleClient } from '../../types';
import ViewPage from '../widgets/ViewPage.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import IconsStore from '../shared/IconsStore.vue';
import IsButton from '../shared/IsButton.vue';
import useLang from '../../helpers/useLang';
import { computed, onBeforeMount } from '#imports';

type Props = {
  client: ModuleClient;
};

const props = defineProps<Props>();
const client = props.client;
const router = client.getRouter();
const themeId = computed(() => router.route.query.themeId);
const cancelLink = computed(() => router.route.query.cancelLink ?? 'index');
const theme = computed(() => client.getThemeById(themeId.value));
const serverTheme = computed(() => theme.value?.serverInfo);

function timestampToDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString().replaceAll(',', '');
}
async function onPull() {
  if (!theme.value) return;

  if (await theme.value.loadInfo(undefined, true)) {
    client.unselectAllThemesAs('edited');
    router.push('index', 'tab-fade-rl');
  }
}
async function onPush() {
  if (!theme.value) return;

  if (await theme.value.saveEditedStyles()) {
    client.unselectAllThemesAs('edited');
    router.push('index', 'tab-fade-rl');
  }
}

onBeforeMount(async () => {
  if (theme.value) {
    if (!await theme.value.loadServerInfo()) {
      router.push(`${cancelLink.value}?themeId=${themeId.value}`, 'tab-fade-lr');
    }
  } else {
    router.push(`${cancelLink.value}?themeId=${themeId.value}`, 'tab-fade-lr');
    return;
  }
});
</script>

<template>
  <ViewPage
    page="editThemeConflict"
    :loader="theme?.loader"
  >
    <div class="TE-theme-edit-conflict">
      <div class="TE-theme-edit-conflict__header">
        <div class="TE-theme-edit-conflict__header__icon">
          <IconsStore icon="Warn" />
        </div>
        <div class="TE-theme-edit-conflict__header__title">
          {{ useLang('pageEditConflict.title') }}
        </div>
      </div>
      <div class="TE-theme-edit-conflict__cards">
        <div
          v-if="serverTheme"
          class="TE-theme-edit-conflict__cards__card"
        >
          <div class="TE-theme-edit-conflict__cards__card__title">
            {{ useLang('pageEditConflict.server') }}
            <div class="TE-theme-edit-conflict__cards__card__title__date">
              {{ timestampToDate(serverTheme.timestamp) }}
            </div>
          </div>
          <theme-block
            :theme="serverTheme"
            :use-global-styles="false"
          >
            <template #preview>
              <slot name="preview" />
            </template>
          </theme-block>
        </div>
        <div
          v-if="theme"
          class="TE-theme-edit-conflict__cards__card"
        >
          <div class="TE-theme-edit-conflict__cards__card__title">
            {{ useLang('pageEditConflict.local') }}
            <div class="TE-theme-edit-conflict__cards__card__title__date">
              {{ timestampToDate(theme.timestamp) }}
            </div>
          </div>
          <theme-block :theme="theme">
            <template #preview>
              <slot name="preview" />
            </template>
          </theme-block>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="TE-theme-edit-conflict__buttons">
        <is-button @click="onPull">
          {{ useLang('pageEditConflict.buttons.pull') }}
        </is-button>
        <is-button @click="onPush">
          {{ useLang('pageEditConflict.buttons.push') }}
        </is-button>
      </div>
    </template>
  </ViewPage>
</template>

<style lang="scss" scoped>
.TE-theme-edit-conflict {
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
  height: 100%;
  padding: 10px;

  &__header {
    color: var(--title);

    &__icon {
      display: flex;
      justify-content: center;

      & > svg {
        height: 200px;
      }
    }
    &__title {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
  }
  &__cards {
    &__card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
      margin-top: 25px;

      &__title {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--title);

        &__date {
          font-size: 10px;
          padding: 2px 5px;
          border: 1px solid var(--border);
          border-radius: 5px;
        }
      }

      & > .TE-theme-block {
        cursor: default;
      }
    }
  }
  &__buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px;
  }
}
</style>
