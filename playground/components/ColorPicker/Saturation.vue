<template>
  <div
    ref="containerRef"
    class="saturation"
    @mousedown.prevent.stop="selectSaturation"
  >
    <canvas ref="containerCanvasRef" />
    <div
      :style="sliderStyles"
      class="slide"
    />
  </div>
</template>

<script lang="ts" setup>
import { createLinearGradient, rgba2hex } from './composible';
import type { CP_HSV, CP_RGB, CP_STYLES_XY, CP_STYLES_POS } from './index.vue';

type Props = {
  hsv: CP_HSV;
  hueColor: CP_RGB;
  isFocus: boolean;
  size?: number;
};
type Emits = {
  (e: 'select', v: CP_RGB): void;
};

const props = withDefaults(defineProps<Props>(), {
  size: 152
});
const emit = defineEmits<Emits>();

const isDrag = ref(false);
const containerRef = ref<HTMLDivElement>();
const containerCanvasRef = ref<HTMLCanvasElement>();
const sliderPosition = reactive<CP_STYLES_XY>({ x: 0, y: 0 });
const sliderStyles = computed<CP_STYLES_POS>(() => ({ left: `${sliderPosition.x}px`, top: `${sliderPosition.y}px` }));

watch(() => props.hsv, () => {
  if (props.isFocus) {
    renderSlide();
  }
});
watch(props.hueColor, () => {
  if (!isDrag.value) {
    renderColor();
    commitColor();
  }
});

function renderColor() {
  const canvas = containerCanvasRef.value!;
  const size = props.size;

  const ctx = canvas.getContext('2d')!;
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = rgba2hex(props.hueColor, false);
  ctx.fillRect(0, 0, size, size);

  createLinearGradient('l', ctx, size, size, '#FFFFFF', 'rgba(255,255,255,0)');
  createLinearGradient('p', ctx, size, size, 'rgba(0,0,0,0)', '#000000');
}
function renderSlide() {
  sliderPosition.x = props.hsv.s * props.size - 5;
  sliderPosition.y = (1 - props.hsv.v) * props.size - 5;
}
function selectSaturation(event: MouseEvent) {
  const { top, left } = containerRef.value!.getBoundingClientRect();

  const mousemove = (event: MouseEvent) => {
    isDrag.value = true;
    let x = event.clientX - left;
    let y = event.clientY - top;

    if (x < 0) x = 0;
    else if (x > props.size) x = props.size;

    if (y < 0) y = 0;
    else if (y > props.size) y = props.size;

    sliderPosition.x = x - 5;
    sliderPosition.y = y - 5;

    blur();
    commitColor();
  };
  const mouseup = () => {
    isDrag.value = false;

    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };

  mousemove(event);

  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
}
function commitColor() {
  if (props.isFocus) return;

  const ctx = getCanvasCtx();
  const imgData = ctx.getImageData(Math.min(sliderPosition.x + 5, props.size - 1), Math.min(sliderPosition.y + 5, props.size - 1), 1, 1);
  const [r, g, b] = imgData.data;
  emit('select', { r, g, b });
}
function getCanvasCtx() {
  const canvas = containerCanvasRef.value!;
  return canvas.getContext('2d')!;
}
function blur() {
  if (document.activeElement) {
    (document.activeElement as any).blur?.();
  }
}

onMounted(() => {
  renderColor();
  renderSlide();
});
</script>

<style lang="scss" scoped>
.saturation {
  position: relative;
  cursor: pointer;

  .slide {
    position: absolute;
    left: 100px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    box-sizing: border-box;
  }
}
</style>
