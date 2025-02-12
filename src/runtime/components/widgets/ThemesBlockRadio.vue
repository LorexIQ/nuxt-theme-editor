<script setup lang="ts">
import ThemeBlockRadio from '../features/ThemeBlockRadio.vue';
import ThemeBlockStatus from '../features/ThemeBlockStatus.vue';
import type { ModuleClient } from '../../types';
import { ref, watch } from '#imports';

type Props = {
  client: ModuleClient;
  modelValue?: string;
};
type Emits = {
  (e: 'update:modelValue', v?: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const innerValue = ref(props.modelValue);

watch(() => props.modelValue, newVal => innerValue.value = newVal);
watch(innerValue, newVal => emit('update:modelValue', newVal));
</script>

<template>
  <div class="TE-block-radio-themes">
    <ThemeBlockRadio
      v-for="theme of client.getThemes()"
      :key="theme.id"
      v-model="innerValue"
      :theme="theme"
    >
      <template #status>
        <ThemeBlockStatus
          view-mode="horizontal"
          :theme="theme"
        />
      </template>
    </ThemeBlockRadio>
  </div>
</template>

<style scoped lang="scss">
.TE-block-radio-themes {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
