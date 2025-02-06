<script setup lang="ts">
import useSwitch from '../../helpers/client/useSwitch';
import TextRunner from './TextRunner.vue';
import IconsStore from './IconsStore.vue';
import { computed, onBeforeMount, ref, watch } from '#imports';

type Props = {
  expandEnabled?: boolean;
  expandDefault?: boolean;
  expandIsInit?: boolean;
  expandAction?: () => any;
};
type Emits = {
  (e: 'changeStatus', v: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  expandEnabled: false,
  expandDefault: false
});
const emit = defineEmits<Emits>();

const loader = useSwitch();
const isError = ref(false);
const isInit = ref(props.expandIsInit ?? false);
const isExpanded = ref(props.expandEnabled ? props.expandDefault : true);
const isRefreshVisible = computed(() => props.expandAction && !loader.status && isInit.value && !isError.value);

watch(isExpanded, status => emit('changeStatus', status));

async function openContent(newStatus: boolean) {
  if (!props.expandEnabled) return;
  if (loader.status) return;

  if (newStatus) {
    try {
      isError.value = false;
      isExpanded.value = true;

      if (props.expandAction && !isInit.value) {
        loader.show();
        await new Promise(resolve => setTimeout(resolve, 300));
        await props.expandAction();
      }

      isInit.value = true;
    } catch {
      isInit.value = false;
      isError.value = true;
    } finally {
      loader.hide();
    }
  } else {
    isExpanded.value = false;
  }
}
async function onClickRefresh(event: Event) {
  event.stopPropagation();
  isInit.value = false;
  await openContent(true);
}

onBeforeMount(() => {
  if (props.expandEnabled && isExpanded.value) {
    openContent(true);
  }
});
</script>

<template>
  <div
    class="TE-drop-down-block"
    :class="{ 'TE-drop-down-block--expand': expandEnabled }"
  >
    <div
      class="TE-drop-down-block__header"
      @click="() => openContent(!isExpanded)"
    >
      <div class="TE-drop-down-block__header__title">
        <TextRunner stop-on-hover>
          <slot name="title">
            Not set
          </slot>
        </TextRunner>
      </div>
      <transition-group
        v-if="expandEnabled"
        name="fade"
        class="TE-drop-down-block__header__actions"
        tag="div"
      >
        <div
          v-if="isRefreshVisible"
          key="refresh"
          class="TE-drop-down-block__header__actions__refresh"
          @click="onClickRefresh"
        >
          <IconsStore icon="Refresh" />
        </div>
        <div
          key="expander"
          class="TE-drop-down-block__header__actions__expander"
          :class="{ 'TE-drop-down-block__header__actions__expander--expanded': isExpanded }"
        >
          <IconsStore
            icon="Arrow"
            size="12"
          />
        </div>
      </transition-group>
    </div>
    <transition-expand class="TE-drop-down-block__content">
      <template v-if="isExpanded">
        <div
          v-if="loader.status"
          class="TE-drop-down-block__content__loader"
        >
          <IconsStore
            icon="Spinner"
            size="18"
          />
          <span>Loading...</span>
        </div>
        <div
          v-else-if="isError"
          class="TE-drop-down-block__content__error"
        >
          <IconsStore
            icon="Refresh"
            size="18"
            @click="onClickRefresh"
          />
          <span>Error loading</span>
        </div>
        <slot
          v-else
          :isExpanded="isExpanded"
        />
      </template>
    </transition-expand>
  </div>
</template>

<style scoped lang="scss">
.TE-drop-down-block {
  &__header {
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 12px;
    font-weight: 600;
    display: grid;
    grid-template-columns: auto max-content;
    justify-content: space-between;
    gap: 8px;
    border-bottom: 1px solid var(--border);
    color: var(--title);
    background-color: var(--bgBlockHeader);

    &__title {
      padding: 10px;
    }
    &__actions {
      display: flex;
      align-items: center;
      gap: 5px;
      padding-right: 8px;

      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;

        & svg {
          width: 100%;
          height: 100%;
        }
      }
      &__refresh {
        transition: .3s color;

        &:hover {
          color: var(--titleTransparent);
        }
      }
      &__expander {
        transition: .3s;

        &--expanded {
          transform: scaleY(-1);
        }
      }
    }
  }
  &__content {
    border-bottom: 1px solid var(--border);

    &__loader, &__error {
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      padding: 8px 0;
      color: var(--titleTransparent);
    }
    &__error {
      & svg {
        color: var(--title);
        cursor: pointer;
        transition: .3s color;

        &:hover {
          color: var(--titleTransparent);
        }
      }
    }
  }

  &--expand {
    .TE-drop-down-block {
      &__header {
        cursor: pointer;
      }
    }
  }
}
</style>
