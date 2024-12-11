<script lang="ts" setup>
type Props = {
  name: string;
  color: string;
};
type Emits = {
  (e: 'inputColor', v: string): void;
  (e: 'inputFocus', v: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modelColor = computed({
  get: () => props.color || '',
  set: value => emit('inputColor', value)
});

function handleFocus(status: boolean) {
  emit('inputFocus', status);
}
</script>

<template>
  <div class="color-picker-box">
    <span class="color-picker-box__name">
      {{ name }}
    </span>
    <input
      v-model="modelColor"
      class="color-picker-box__value"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
  </div>
</template>

<style lang="scss">
.color-picker-box {
  display: flex;
  font-size: 12px;
  border-radius: 2px;
  overflow: hidden;

  &__name {
    width: 60px;
    height: 30px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    background: #e7e8e9;
  }
  &__value {
    flex: 1;
    height: 30px;
    min-width: 100px;
    padding: 0 12px;
    border: 0;
    color: #666;
    background: #eceef0;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }
  }
}
</style>
