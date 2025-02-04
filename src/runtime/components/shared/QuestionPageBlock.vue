<script setup lang="ts">
import type { ModuleIcons, ModulePagesNames } from '../../types';
import IsButton from '../shared/IsButton.vue';
import ViewPage from '../widgets/ViewPage.vue';
import IconsStore from '../shared/IconsStore.vue';
import useSwitch from '../../helpers/client/useSwitch';
import { onBeforeMount } from '#imports';

type Props = {
  icon: ModuleIcons;
  page: ModulePagesNames;
  questionTitle: string;
  firstBtnTitle?: string;
  secondBtnTitle?: string;
  firstBtnDecor?: 'default' | 'success' | 'error';
  secondBtnDecor?: 'default' | 'success' | 'error';
  firstOnClick?: () => any;
  secondOnClick?: () => any;
  firstOnSuccess?: () => any;
  secondOnSuccess?: () => any;
  firstOnError?: () => any;
  secondOnError?: () => any;
  beforeMount?: () => any;
};

const firstBtnLoader = useSwitch();
const secondBtnLoader = useSwitch();
const props = withDefaults(defineProps<Props>(), {
  firstBtnDecor: 'default',
  secondBtnDecor: 'error'
});

async function onFirstClick() {
  if (firstBtnLoader.status) return;

  firstBtnLoader.funcExec(async () => {
    await props.firstOnClick?.();
  }).then(() => {
    props.firstOnSuccess?.();
  }).catch(() => {
    props.firstOnError?.();
  });
}

async function onSecondClick() {
  if (secondBtnLoader.status) return;

  secondBtnLoader.funcExec(async () => {
    await props.secondOnClick?.();
  }).then(() => {
    props.secondOnSuccess?.();
  }).catch(() => {
    props.secondOnError?.();
  });
}

onBeforeMount(() => {
  props.beforeMount?.();
});
</script>

<template>
  <ViewPage :page="page">
    <div class="TE-question-page-block">
      <IconsStore
        :icon="icon"
        size="80px"
      />
      <span>{{ questionTitle }}</span>
      <div class="TE-question-page-block__actions">
        <IsButton
          v-if="firstBtnTitle"
          :decor="firstBtnDecor"
          @click="onFirstClick"
        >
          <div
            v-if="firstBtnLoader.status"
            class="TE-question-page-block__actions__loader"
          >
            <IconsStore
              icon="Spinner"
              size="15"
            />
          </div>
          <template v-else>
            {{ firstBtnTitle }}
          </template>
        </IsButton>
        <IsButton
          v-if="secondBtnTitle"
          :decor="secondBtnDecor"
          @click="onSecondClick"
        >
          <div
            v-if="secondBtnLoader.status"
            class="TE-question-page-block__actions__loader"
          >
            <IconsStore
              icon="Spinner"
              size="15"
            />
          </div>
          <template v-else>
            {{ secondBtnTitle }}
          </template>
        </IsButton>
      </div>
    </div>
    <template #messages>
      <slot name="messages" />
    </template>
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

    &__loader {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
}
</style>
