<script lang="ts" setup generic="T">
import { isUndefined } from './composible';
import type { CP_STYLES_XY, CP_STYLES_POS } from './types';

type Props = {
  mode: 'xy' | 'x' | 'y';
  bgGenerator: (ctx: CanvasRenderingContext2D, width: number, height: number) => any;
  selectGenerator: (ctx: CanvasRenderingContext2D, width: number, height: number, sliderPos: CP_STYLES_XY) => T;
  sliderXYGenerator: (width: number, height: number) => Partial<CP_STYLES_XY>;
  preventSelect: boolean;
  width: number;
  height: number;
  sliderBg?: string;
};
type Emits = {
  (e: 'select', v: T): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isX = ['xy', 'x'].includes(props.mode);
const isY = ['xy', 'y'].includes(props.mode);

const isDrag = ref(false);
const containerRef = ref<HTMLDivElement>();
const containerCanvasRef = ref<HTMLCanvasElement>();
const sliderPosition = reactive<CP_STYLES_XY>({ x: 0, y: 0 });
const sliderStyles = computed<CP_STYLES_POS>(() => ({ left: `${sliderPosition.x}px`, top: `${sliderPosition.y}px` }));

function renderBg() {
  const canvas = containerCanvasRef.value!;
  const width = props.width;
  const height = props.height;

  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  props.bgGenerator(ctx, width, height);
}
function renderSlider() {
  const buildPosition = props.sliderXYGenerator(props.width, props.height);
  if (!isUndefined(buildPosition.x)) sliderPosition.x = buildPosition.x;
  if (!isUndefined(buildPosition.y)) sliderPosition.y = buildPosition.y;
}
function select(event: MouseEvent) {
  const { top, left } = containerRef.value!.getBoundingClientRect();

  const mousemove = (event: MouseEvent) => {
    isDrag.value = true;
    let x = event.clientX - left;
    let y = event.clientY - top;
    const halfSlider = isX && isY ? 5 : 2;

    if (isX) {
      if (x < 0) x = 0;
      else if (x > props.width) x = props.width;
      sliderPosition.x = x - halfSlider;
    }

    if (isY) {
      if (y < 0) y = 0;
      else if (y > props.height) y = props.height;
      sliderPosition.y = y - halfSlider;
    }

    blur();
    commitSelect();
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
function commitSelect() {
  if (props.preventSelect) return;

  const ctx = getCanvasCtx();
  emit('select', props.selectGenerator(ctx, props.width, props.height, sliderPosition));
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
  renderBg();
  renderSlider();
});

defineExpose({
  isDrag,
  renderBg,
  renderSlider,
  commitSelect
});
</script>

<template>
  <div
    ref="containerRef"
    class="canvas-picker"
    :class="`canvas-picker--${mode}`"
    :style="{ height: `${height}px` }"
    @mousedown.prevent.stop="select"
  >
    <canvas ref="containerCanvasRef" />
    <div
      :style="{
        ...sliderStyles,
        backgroundColor: sliderBg,
      }"
      class="canvas-picker__slider"
    />
  </div>
</template>

<style lang="scss" scoped>
.canvas-picker {
  position: relative;
  width: max-content;
  cursor: pointer;

  & > canvas {
    border-radius: 2px;
  }
  &__slider {
    position: absolute;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    box-sizing: border-box;
  }

  &--xy .canvas-picker__slider {
    left: 100px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 2px 0.5px rgba(0, 0, 0, 0.2) inset, 0 0 1px 1px rgba(0, 0, 0, 0.3);
  }
  &--x .canvas-picker__slider {
    left: 100px;
    top: 0;
    width: 4px;
    height: 100%;
    border-radius: 2px;
    background: #fff;
  }
  &--y .canvas-picker__slider {
    left: 0;
    top: 100px;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: #fff;
  }
}
</style>
