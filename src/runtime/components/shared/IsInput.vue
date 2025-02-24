<script setup lang="ts">
import type { ModuleIcons } from '../../types';
import IconsStore from './IconsStore.vue';
import { ref, watch, computed } from '#imports';

type Props = {
  id: string;
  modelValue: string;
  title?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isRequiredIcon?: boolean;
  maxLength?: number;
  postIcon?: ModuleIcons;
  postIconVisible?: (value: string) => boolean;
};
type Emits = {
  (e: 'update:modelValue', value: string): void;
  (e: 'click:postIcon', value: MouseEvent): void;
};

const props = withDefaults(defineProps<Props>(), {
  postIconVisible: () => () => true
});
const emit = defineEmits<Emits>();
const maxLength = props.maxLength;

const isAnimation = ref(false);
const isPostIconVisible = computed(() => props.postIcon && props.postIconVisible(innerValue.value));
const innerValue = ref(props.modelValue);
const maxLengthRemained = computed(() => {
  const remained = (props.maxLength ?? 0) - innerValue.value.length;
  return remained < 0 ? 0 : remained;
});

watch(() => props.modelValue, value => innerValue.value = value);
watch(innerValue, (value) => {
  if (maxLength && value.length > maxLength) {
    innerValue.value = value.slice(0, maxLength);
    isAnimation.value = false;
    setTimeout(() => isAnimation.value = true, 50);
  }
  emit('update:modelValue', innerValue.value);
});
</script>

<template>
  <div
    class="TE-is-input"
    :class="{
      'TE-is-input--with-max-length': maxLength && !isPostIconVisible,
      'TE-is-input--with-post-icon': isPostIconVisible && !maxLength,
      'TE-is-input--with-post-icon-and-max-length': maxLength && isPostIconVisible,
      'TE-is-input--disabled': isDisabled,
      'x-shake': isAnimation,
    }"
  >
    <div
      v-if="title"
      class="TE-is-input__title"
    >
      {{ title }}
      <IconsStore
        v-if="isRequiredIcon && !isDisabled"
        icon="Asterisk"
      />
    </div>
    <input
      :id="`TE-input-${id}`"
      v-model="innerValue"
      :disabled="isDisabled"
      class="TE-is-input__input"
      :placeholder="placeholder"
      autocomplete="off"
    >
    <div
      ref="maxLengthRef"
      class="TE-is-input__length"
      :class="{ 'TE-is-input__length--null': !maxLengthRemained }"
    >
      {{ maxLengthRemained }}
    </div>
    <transition name="fade">
      <div
        v-if="isPostIconVisible"
        class="TE-is-input__post-icon"
      >
        <icons-store
          :icon="postIcon!"
          @click="emit('click:postIcon', $event)"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.TE-is-input {
  position: relative;

  &__title {
    position: absolute;
    top: -7px;
    left: 5px;
    font-size: 12px;
    display: flex;
    align-items: flex-start;
    width: max-content;
    padding: 0 5px;
    border-radius: 3px;
    color: var(--inputTitle);
    background-color: var(--inputBg);

    & > svg {
      font-size: 12px;
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
  &__length {
    font-size: 14px;
    position: absolute;
    top: 6px;
    right: 0;
    bottom: 6px;
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    padding: 0 8px;
    border-left: 1px solid var(--inputTitle);

    &--null {
      color: var(--inputRequired);
    }
  }
  &__post-icon {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 5px;
    color: var(--inputPostIcon);
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  &--disabled {
    opacity: 0.5;
  }
  &--with-max-length {
    .TE-is-input {
      &__input {
        padding: 8px 50px 8px 10px;
      }
      &__length {
        display: flex;
      }
      &__post-icon {
        right: 41px;
      }
    }
  }
  &--with-post-icon {
    .TE-is-input {
      &__input {
        padding: 8px 28px 8px 10px;
      }
    }
  }
  &--with-post-icon-and-max-length {
    .TE-is-input {
      &__input {
        padding: 8px 70px 8px 10px;
      }
      &__length {
        display: flex;
      }
      &__post-icon {
        right: 41px;
      }
    }
  }
}

@keyframes x-shake {
  0% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  100% { transform: translateX(-2px); }
}
.x-shake {
  animation-name: x-shake;
  animation-duration: .15s;
  animation-iteration-count: 2;
}
</style>
