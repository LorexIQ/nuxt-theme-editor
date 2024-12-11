<script lang="ts" setup>
import { createAlphaSquare } from './composible';

type Props = {
  color: string;
  oldColor: string;
};

const props = defineProps<Props>();

const containerRef = ref<HTMLCanvasElement>();
const width = 198;

watch(() => props.color, () => renderColor());

function renderColor() {
  const canvas = containerRef.value!;
  const height = 30;
  const canvasSquare = createAlphaSquare(5);

  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')!;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = props.color;
  ctx.fillRect(0, 0, width / 2, height);

  ctx.fillStyle = props.oldColor;
  ctx.fillRect(width / 2, 0, width / 2, height);
}

onMounted(() => {
  renderColor();
});
</script>

<template>
  <div class="color-picker-preview">
    <canvas ref="containerRef" />
  </div>
</template>

<style lang="scss" scoped>
.color-picker-preview {
  position: relative;
  height: 30px;
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 1px 0.5px rgba(0, 0, 0, 0.2) inset;
  }
}
</style>
