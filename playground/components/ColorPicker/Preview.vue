<script lang="ts" setup>
import { createAlphaSquare } from './composible';

type Props = {
  color: string;
  width: number;
};

const props = defineProps<Props>();

const containerRef = ref<HTMLCanvasElement>();
const alphaSize = ref(5);

watch(() => props.color, () => renderColor());

function renderColor() {
  const canvas = containerRef.value!;
  const width = props.width;
  const height = 30;
  const size = alphaSize.value;
  const canvasSquare = createAlphaSquare(size);

  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')!;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = props.color;
  ctx.fillRect(0, 0, width, height);
}

onMounted(() => {
  renderColor();
});
</script>

<template>
  <canvas ref="containerRef" />
</template>

<style lang="scss" scoped>
canvas {
  border-radius: 2px;
}
</style>
