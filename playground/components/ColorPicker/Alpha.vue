<script lang="ts" setup>
import { createAlphaSquare, createLinearGradient, rgba2hex } from './composible';
import type { CP_RGBA, CP_STYLES_Y } from './types';
import CanvasPicker from './CanvasPicker.vue';

type Props = {
  rgba: CP_RGBA;
};
type Emits = {
  (e: 'select', v: number): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const pickerRef = ref();

watch(() => props.rgba, () => {
  const _pickerRef = pickerRef.value;
  _pickerRef.renderBg();
  if (!_pickerRef.isDrag) _pickerRef.renderSlider();
});

function bgGenerator(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = ctx.createPattern(createAlphaSquare(5), 'repeat')!;
  ctx.fillRect(0, 0, width, height);

  createLinearGradient(
    'p',
    ctx,
    width,
    height,
    'rgba(255,255,255,0)',
    rgba2hex({ r: props.rgba.r, g: props.rgba.g, b: props.rgba.b })
  );
}
function selectGenerator(ctx: CanvasRenderingContext2D, width: number, height: number, { y }: CP_STYLES_Y) {
  return parseFloat(((y + 2) / height).toFixed(2));
}
function sliderXYGenerator(width: number, height: number): CP_STYLES_Y {
  return {
    y: props.rgba.a * height - 2
  };
}
</script>

<template>
  <CanvasPicker
    ref="pickerRef"
    mode="y"
    :bg-generator="bgGenerator"
    :select-generator="selectGenerator"
    :slider-x-y-generator="sliderXYGenerator"
    :prevent-select="false"
    :width="15"
    :height="152"
    @select="emit('select', $event)"
  />
</template>
