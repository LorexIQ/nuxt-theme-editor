<script lang="ts" setup>
import { createLinearGradient, rgba2hex } from './composible';
import type { CP_RGB, CP_RGBAHSV, CP_STYLES_XY } from './types';
import CanvasPicker from './CanvasPicker.vue';

type Props = {
  color: CP_RGBAHSV;
  hueColor: CP_RGB;
  preventSelect: boolean;
};
type Emits = {
  (e: 'select', v: CP_RGB): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const pickerRef = ref();

watch(props.color, () => {
  const _pickerRef = pickerRef.value;
  if (props.preventSelect) _pickerRef.renderSlider();
});
watch(props.hueColor, () => {
  const _pickerRef = pickerRef.value;
  if (!_pickerRef.isDrag) {
    _pickerRef.renderBg();
    _pickerRef.commitSelect();
  }
});

function bgGenerator(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = rgba2hex(props.hueColor, false);
  ctx.fillRect(0, 0, width, height);

  createLinearGradient('l', ctx, width, height, '#FFFFFF', 'rgba(255,255,255,0)');
  createLinearGradient('p', ctx, width, height, 'rgba(0,0,0,0)', '#000000');
}
function selectGenerator(ctx: CanvasRenderingContext2D, width: number, height: number, { x, y }: CP_STYLES_XY) {
  const imgData = ctx.getImageData(Math.min(x + 5, width - 1), Math.min(y + 5, height - 1), 1, 1);
  const [r, g, b] = imgData.data;
  return { r, g, b };
}
function sliderXYGenerator(width: number, height: number): CP_STYLES_XY {
  return {
    x: props.color.s * width - 5,
    y: (1 - props.color.v) * height - 5
  };
}
</script>

<template>
  <CanvasPicker
    ref="pickerRef"
    mode="xy"
    :bg-generator="bgGenerator"
    :select-generator="selectGenerator"
    :slider-x-y-generator="sliderXYGenerator"
    :prevent-select="preventSelect"
    :slider-bg="`rgb(${color.r}, ${color.g}, ${color.b})`"
    @select="emit('select', $event)"
  />
</template>
