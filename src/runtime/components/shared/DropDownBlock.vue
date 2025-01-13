<script setup lang="ts">
import TextRunner from './TextRunner.vue';
import IconsStore from './IconsStore.vue';
import { ref } from '#imports';

type Props = {
  expandEnabled?: boolean;
  expandDefault?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  expandEnabled: false,
  expandDefault: false
});

const isExpanded = ref(props.expandEnabled ? props.expandDefault : true);

function onClick() {
  if (props.expandEnabled) {
    isExpanded.value = !isExpanded.value;
  }
}
</script>

<template>
  <div
    class="TE-drop-down-block"
    :class="{ 'TE-drop-down-block--expand': expandEnabled }"
  >
    <div
      class="TE-drop-down-block__header"
      @click="onClick"
    >
      <TextRunner stop-on-hover>
        <slot name="title">
          Not set
        </slot>
      </TextRunner>
      <div
        v-if="expandEnabled"
        class="TE-drop-down-block__header__expander"
        :class="{ 'TE-drop-down-block__header__expander--expanded': isExpanded }"
      >
        <IconsStore icon="Arrow" />
      </div>
    </div>
    <transition-expand class="TE-drop-down-block__content">
      <slot
        v-if="isExpanded"
        :isExpanded="isExpanded"
      />
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
    grid-template-columns: auto 12px;
    justify-content: space-between;
    gap: 8px;
    padding: 10px;
    border-bottom: 1px solid var(--border);
    color: var(--title);
    background-color: var(--bgBlockHeader);

    &__expander {
      display: flex;
      align-items: center;
      transition: .3s;

      &--expanded {
        transform: scaleY(-1);
      }
    }
  }
  &__content {
    border-bottom: 1px solid var(--border);
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
