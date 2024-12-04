<script setup lang="ts">
import IsRadio from '../shared/IsRadio.vue';
import type { ModuleThemeRootReturn } from '../../types';
import { ref, watch } from '#imports';

type Props = {
  theme: ModuleThemeRootReturn;
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
  <div
    class="TE-radio-theme-block"
    @click="innerValue = theme.id"
  >
    <IsRadio
      v-model="innerValue"
      :value="theme.id"
    />
    <div class="TE-radio-theme-block__name">
      {{ theme.name }}
    </div>
    <slot name="status" />
  </div>
</template>

<style scoped lang="scss">
.TE-radio-theme-block {
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
}
</style>
