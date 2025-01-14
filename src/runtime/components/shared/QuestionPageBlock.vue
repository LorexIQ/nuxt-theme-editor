<script setup lang="ts">
import type { ModuleIcons } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IconsStore from '../shared/IconsStore.vue';
import { onBeforeMount } from '#imports';

type Props = {
  icon: ModuleIcons;
  questionTitle: string;
  firstBtnTitle: string;
  secondBtnTitle: string;
  firstBtnDecor?: 'default' | 'success' | 'error';
  secondBtnDecor?: 'default' | 'success' | 'error';
  beforeMount?: () => any;
};
type Emits = {
  (e: 'clickFirst', v: MouseEvent): void;
  (e: 'clickSecond', v: MouseEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
  firstBtnDecor: 'default',
  secondBtnDecor: 'error'
});
const emit = defineEmits<Emits>();

onBeforeMount(() => {
  props.beforeMount?.();
});
</script>

<template>
  <ViewPage>
    <div class="TE-question-page-block">
      <IconsStore
        :icon="icon"
        size="80px"
      />
      <span>{{ questionTitle }}</span>
      <div class="TE-question-page-block__actions">
        <IsButton
          :decor="firstBtnDecor"
          @click="emit('clickFirst', $event)"
        >
          {{ firstBtnTitle }}
        </IsButton>
        <IsButton
          :decor="secondBtnDecor"
          @click="emit('clickSecond', $event)"
        >
          {{ secondBtnTitle }}
        </IsButton>
      </div>
    </div>
  </ViewPage>
</template>

<style lang="scss" scoped>
.TE-question-page-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: 100%;
  text-align: center;

  & h1 {
    font-family: 'Segoe Print', sans-serif;
    font-weight: 600;
    font-size: 70px;
    line-height: 80px;
    color: var(--title);
  }
  & span {
    font-size: 14px;
    font-weight: 600;
    color: var(--title);
  }
  & .TE-is-button {
    margin-top: 10px;
  }

  &__actions {
    display: flex;
    gap: 5px;
  }
}
</style>
