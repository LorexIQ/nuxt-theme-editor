<template>
  <div class="color-type">
    <span class="name">
      {{ name }}
    </span>
    <input
      v-model="modelColor"
      class="value"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
  </div>
</template>

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

<style lang="scss">
.color-type {
  display: flex;
  margin-top: 8px;
  font-size: 12px;

  .name {
    width: 60px;
    height: 30px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    background: #252930;
  }
  .value {
    flex: 1;
    height: 30px;
    min-width: 100px;
    padding: 0 12px;
    border: 0;
    color: #fff;
    background: #2e333a;
    box-sizing: border-box;
  }
}
</style>
