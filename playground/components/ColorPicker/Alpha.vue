<script lang="ts" setup>
import { createAlphaSquare, createLinearGradient, rgba2hex } from './composible';
import type { CP_RGBA, CP_STYLES_Y, CP_STYLES_TOP } from './index.vue';

type Props = {
  rgba: CP_RGBA;
  width?: number;
  height?: number;
};
type Emits = {
  (e: 'select', v: number): void;
};

const props = withDefaults(defineProps<Props>(), {
  width: 15,
  height: 152
});
const emit = defineEmits<Emits>();

const isDrag = ref(false);
const containerRef = ref<HTMLDivElement>();
const containerCanvasRef = ref<HTMLCanvasElement>();
const sliderPosition = reactive<CP_STYLES_Y>({ y: 0 });
const sliderStyles = computed<CP_STYLES_TOP>(() => ({ top: `${sliderPosition.y}px` }));
const alphaSize = ref(5);

watch(() => props.rgba, () => {
  renderColor();
  if (!isDrag.value) renderSlide();
});

function renderColor() {
  const canvas = containerCanvasRef.value!;
  const width = props.width;
  const height = props.height;
  const size = alphaSize.value;
  const canvasSquare = createAlphaSquare(size);

  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')!;
  ctx.fillRect(0, 0, width, height);

  createLinearGradient(
    'p',
    ctx,
    width,
    height,
    'rgba(255,255,255,0)',
    rgba2hex({ r: props.rgba.r, g: props.rgba.g, b: props.rgba.b }, false)
  );
}
function renderSlide() {
  sliderPosition.y = props.rgba.a * props.height - 2;
}
function selectAlpha(e: MouseEvent) {
  const { top: hueTop } = containerRef.value!.getBoundingClientRect();

  const mousemove = (e: MouseEvent) => {
    isDrag.value = true;
    let y = e.clientY - hueTop;

    if (y < 0) y = 0;
    else if (y > props.height) y = props.height;

    sliderPosition.y = y;

    blur();
    commitColor();
  };
  const mouseup = () => {
    isDrag.value = false;

    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };

  mousemove(e);

  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
}
function commitColor() {
  emit('select', parseFloat((sliderPosition.y / props.height).toFixed(2)));
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

<template>
  <div
    ref="containerRef"
    class="color-alpha"
    @mousedown.prevent.stop="selectAlpha"
  >
    <canvas ref="containerCanvasRef" />
    <div
      :style="sliderStyles"
      class="slide"
    />
  </div>
</template>

<style lang="scss" scoped>
.color-alpha {
  position: relative;
  margin-left: 8px;
  cursor: pointer;

  .slide {
    position: absolute;
    left: 0;
    top: 100px;
    width: 100%;
    height: 4px;
    background: #fff;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
