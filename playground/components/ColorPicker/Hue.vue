<script lang="ts" setup>
import type { CP_RGBH, CP_STYLES_TOP, CP_STYLES_Y } from './index.vue';
import { rgb2rgbHue } from './composible';

type Props = {
  color: CP_RGBH;
  width?: number;
  height?: number;
};
type Emits = {
  (e: 'select', v: CP_RGBH): void;
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

watch(props.color, () => {
  if (!isDrag.value) {
    renderSlide();
  }
});

function renderColor() {
  const canvas = containerCanvasRef.value!;
  const width = props.width;
  const height = props.height;

  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0.01, '#FF0000');
  gradient.addColorStop(0.17, '#FF00FF');
  gradient.addColorStop(0.17 * 2, '#0000FF');
  gradient.addColorStop(0.17 * 3, '#00FFFF');
  gradient.addColorStop(0.17 * 4, '#00FF00');
  gradient.addColorStop(0.17 * 5, '#FFFF00');
  gradient.addColorStop(0.99, '#FF0000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
function renderSlide() {
  sliderPosition.y = (1 - props.color.h / 360) * props.height - 2;
}
function selectHue(event: MouseEvent) {
  const { top: hueTop } = containerRef.value!.getBoundingClientRect();

  const mousemove = (e: any) => {
    isDrag.value = true;
    let y = e.clientY - hueTop;

    if (y < 0) y = 0;
    else if (y > props.height) y = props.height;

    sliderPosition.y = y - 2;

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
  const ctx = getCanvasCtx();
  const imgData = ctx.getImageData(0, Math.min(sliderPosition.y, props.height - 1), 1, 1);
  const [r, g, b] = imgData.data;
  emit('select', rgb2rgbHue({ r, g, b }));
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

<template>
  <div
    ref="containerRef"
    class="hue"
    @mousedown.prevent.stop="selectHue"
  >
    <canvas ref="containerCanvasRef" />
    <div
      :style="sliderStyles"
      class="slide"
    />
  </div>
</template>

<style lang="scss" scoped>
.hue {
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
