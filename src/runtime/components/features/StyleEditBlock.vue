<script setup lang="ts">
import { computed } from '#imports';

type Props = {
  id: string;
  styleKey: string;
  styles: Record<string, string>;
  rawStyles: Record<string, string>;
};

const props = defineProps<Props>();

const currentValue = computed(() => props.styles[props.styleKey]);
const rawValue = computed(() => props.rawStyles[props.styleKey]);
</script>

<template>
  <div class="TE-style-edit-block">
    <div
      class="TE-style-edit-block__picker"
      :style="{ backgroundColor: currentValue }"
    />
    <div class="TE-style-edit-block_key">
      {{ styleKey }} = {{ currentValue }} ({{ rawValue }})
    </div>
  </div>
</template>

<style scoped lang="scss">
.TE-style-edit-block {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px;
  border-bottom: 1px solid var(--border);

  &__picker {
    aspect-ratio: 1;
    width: 27px;
    border: 1px solid var(--border);
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
