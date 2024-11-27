<script setup lang="ts" generic="T extends any">
import IconAsterisk from '../icons/IconAsterisk.vue';
import { ref, watch } from '#imports';

type Props = {
  id: string;
  title: string;
  modelValue: T;
  placeholder?: string;
  isRequiredIcon?: boolean;
};
type Emits = {
  (e: 'update:modelValue', value: T): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const innerValue = ref(props.modelValue);

watch(() => props.modelValue, value => innerValue.value = value);
watch(innerValue, value => emit('update:modelValue', value));
</script>

<template>
  <div class="TE-is-input">
    <div class="TE-is-input__title">
      {{ title }}
      <IconAsterisk v-if="isRequiredIcon" />
    </div>
    <input
      :id="`TE-${id}`"
      v-model="innerValue"
      class="TE-is-input__input"
      :placeholder="placeholder"
    >
  </div>
</template>

<style scoped lang="scss">
.TE-is-input {
  &__title {
    position: relative;
    z-index: 1;
    font-size: 12px;
    display: flex;
    align-items: flex-start;
    width: max-content;
    margin: 0 0 -7px 5px;
    padding: 0 5px;
    color: var(--inputTitle);
    background-color: var(--inputBg);

    & > svg {
      font-size: 10px;
      color: var(--inputRequired);
    }
  }
  &__input {
    font-size: 16px;
    width: 100%;
    padding: 8px 10px;
    border-radius: 5px;
    border: 1px solid var(--inputTitle);
    color: var(--inputText);
    background-color: var(--inputBg);

    &::placeholder {
      color: var(--inputPlaceholder);
    }
    &:focus {
      outline: 1px solid var(--inputFocus);
    }
  }
}
</style>
