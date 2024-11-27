<script setup lang="ts">
import InputData from '../features/InputData.vue';
import type { Client } from '../../classes/Client';
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
type Emits = {
  (e: 'onGoBack'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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
        <InputData
          id="id"
          v-model="themeCreateData.id"
          title="ID"
          is-required-icon
        />
      </div>
      <div class="TE-theme-create__row">
        <InputData
          id="name"
          v-model="themeCreateData.name"
          title="Наименование"
          :placeholder="themeCreateData.id"
        />
      </div>
      <div class="TE-theme-create__row">
        <InputData
          id="description"
          v-model="themeCreateData.description"
          title="Описание"
        />
      </div>
      <div class="TE-theme-create__row">
        <div
          v-for="theme of client.getThemes()"
          :key="theme.id"
        >
          {{ theme.name }}
        </div>
      </div>
      <div class="TE-theme-create__row">
        <button @click="emit('onGoBack')">
          Назад
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
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
