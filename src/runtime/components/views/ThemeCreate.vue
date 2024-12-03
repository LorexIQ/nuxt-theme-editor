<script setup lang="ts">
import type { ModuleClient } from '../../types';
import ThemeBlockStatus from '../features/ThemeBlockStatus.vue';
import IsInput from '../shared/IsInput.vue';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IsRadio from '../shared/IsRadio.vue';
import ThemeBlock from '../features/ThemeBlock.vue';
import NotifyBlock from '../shared/NotifyBlock.vue';
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
      <div class="TE-theme-create__row">
        <div class="ttt">
          <div
            v-for="theme of client.getThemes()"
            :key="theme.id"
            class="ttt__row"
            @click="themeCreateData.parentThemeId = theme.id"
          >
            <IsRadio
              v-model="themeCreateData.parentThemeId"
              :value="theme.id"
            />
            <div class="ttt__row__name">
              {{ theme.name }}
            </div>
            <ThemeBlockStatus
              view-mode="horizontal"
              :client="client"
              :theme="theme"
            />
          </div>
        </div>
      </div>
      <div
        class="TE-theme-create__row"
        style="display: flex; flex-direction: column; gap: 5px"
      >
        <NotifyBlock type="info">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, accusamus aperiam architecto asperiores, aut autem, enim eos facere mollitia nostrum odit perferendis porro praesentium qui recusandae ullam voluptatum. Hic, quis?
        </NotifyBlock>
        <NotifyBlock type="tip" />
        <NotifyBlock type="warn">
          123
        </NotifyBlock>
        <NotifyBlock type="error">
          123
        </NotifyBlock>
      </div>
    </div>
    <template #footer>
      <div class="TE-theme-create-footer">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Назад
        </IsButton>
      </div>
    </template>
  </ViewPage>
</template>

<style scoped lang="scss">
.ttt {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__row {
    display: grid;
    grid-template-columns: 30px 1fr auto;
    align-items: center;
    height: 30px;
    border: 1px solid var(--border);
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    transition: .3s;

    &:hover {
      background-color: var(--bgHover);
    }
    &:active {
      transform: scale(0.99);
    }
  }
}
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
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
}
</style>
