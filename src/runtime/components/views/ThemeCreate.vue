<script setup lang="ts">
import IsInput from '../shared/IsInput.vue';
import type { Client } from '../../classes/Client';
import IsButton from '../shared/IsButton.vue';
import ThemeBlockStatus from '../features/ThemeBlockStatus.vue';
import { reactive } from '#imports';

type ThemeCreateData = {
  id: string;
  name: string;
  description: string;
  parentTheme?: string;
};

type Props = {
  client: Client;
};

const props = defineProps<Props>();

const client = props.client;
const router = client.getRouter();
const themeCreateData = reactive<ThemeCreateData>({
  id: '',
  name: '',
  description: '',
  parentTheme: undefined
});
</script>

<template>
  <transition :name="router.getTransitionName()">
    <div
      v-if="router.getPath() === 'newTheme'"
      class="TE-theme-create"
    >
      <div class="TE-theme-create__row">
        <IsInput
          id="id"
          v-model="themeCreateData.id"
          title="ID"
          is-required-icon
        />
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="name"
          v-model="themeCreateData.name"
          title="Наименование"
          :placeholder="themeCreateData.id"
        />
      </div>
      <div class="TE-theme-create__row">
        <IsInput
          id="description"
          v-model="themeCreateData.description"
          title="Описание"
        />
      </div>
      <div class="TE-theme-create__row">
        <div class="ttt">
          <div
            v-for="theme of client.getThemes()"
            :key="theme.id"
            class="ttt__row"
          >
            <div class="ttt__row__radio">
              <input type="radio">
            </div>
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
      <div class="TE-theme-create__row">
        <IsButton @click="router.push('index', 'tab-fade-rl')">
          Назад
        </IsButton>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.ttt {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__row {
    display: grid;
    grid-template-columns: 20px 1fr auto;
    border: 1px solid var(--border);
    border-radius: 5px;
    overflow: hidden;
  }
}
.TE-theme-create {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

  &__title {
    text-align: center;
    padding-bottom: 10px;
  }
}
</style>
