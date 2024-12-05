<script setup lang="ts">
import { computed, ref, watch } from '#imports';

type Props = {
  modelValue: boolean;
};
type Emits = {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'check'): void;
  (e: 'uncheck'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const innerValue = ref(props.modelValue);
const switchRef = ref<HTMLDivElement>();
const switchHeight = computed(() => switchRef.value?.clientHeight ?? 20);
const circleLeftPos = computed(() => (switchRef.value?.clientWidth ?? 40) - switchHeight.value + 'px');

watch(() => props.modelValue, newVal => innerValue.value = newVal);
watch(innerValue, (newVal) => {
  emit('update:modelValue', newVal);
  if (newVal) emit('check');
  else emit('uncheck');
});
</script>

<template>
  <div
    ref="switchRef"
    class="TE-is-switch"
    :class="{ 'TE-is-switch--checked': innerValue }"
    @click="innerValue = !innerValue"
  >
    <div class="TE-is-switch__slider" />
    <div class="TE-is-switch__circle" />
  </div>
</template>

<style scoped lang="scss">
.TE-is-switch {
  position: relative;
  width: 40px;
  height: 20px;
  padding: 5px;
  cursor: pointer;

  &__slider {
    height: 10px;
    background-color: var(--switchSlider);
    border: 1px solid var(--switchSliderBorder);
    border-radius: 5px;
  }
  &__circle {
    position: absolute;
    top: 0;
    left: 0;
    aspect-ratio: 1;
    height: 100%;
    background-color: var(--switchCircle);
    border: 1px solid var(--switchCircleBorder);
    border-radius: 50%;
    transition: .3s;
  }

  &--checked {
    & .TE-is-switch {
      &__slider {
        background-color: var(--switchSliderChecked);
      }
      &__circle {
        left: v-bind(circleLeftPos);
        background-color: var(--switchCircleChecked);
      }
    }
  }
}
</style>
