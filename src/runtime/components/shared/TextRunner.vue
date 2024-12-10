<script setup lang="ts">
import { computed, onMounted, ref, watch } from '#imports';

type Props = {
  pxPerSecond?: number;
  reverseTimeout?: number;
  stopOnHover?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  pxPerSecond: 60,
  reverseTimeout: 2000,
  stopOnHover: false
});

const interval = 1000 / 30;
const step = Math.round((props.pxPerSecond / (1000 / interval)) * 100) / 100;

const containerRef = ref<HTMLDivElement>();
const containerWidth = ref(0);
const containerScrollWidth = ref(0);
let updatePosTimeout: NodeJS.Timeout | undefined = undefined;
let enableAnimationTimeout: NodeJS.Timeout | undefined = undefined;
let awaitReverseTimeout: NodeJS.Timeout | undefined = undefined;

const isScrollActive = computed(() => containerWidth.value < containerScrollWidth.value);
const isReversed = ref(false);
const isHover = ref(false);

const resizeObserver = new ResizeObserver(([container]) => {
  container.target.scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  clearTimeout(enableAnimationTimeout);
  clearInterval(updatePosTimeout);

  containerWidth.value = 0;
  containerScrollWidth.value = 0;

  enableAnimationTimeout = setTimeout(() => {
    containerWidth.value = container.contentRect.width;
    containerScrollWidth.value = container.target.scrollWidth;
  }, 500);
});

watch(isScrollActive, (status) => {
  const container = containerRef.value;
  clearInterval(updatePosTimeout);

  if (status && container) {
    updatePosTimeout = setInterval(() => {
      if (awaitReverseTimeout || isHover.value) return;

      container.scrollBy({
        left: isReversed.value ? step / -2 : step,
        behavior: 'smooth'
      });

      if (!container.scrollLeft && isReversed.value) {
        isReversed.value = false;
      } else if (!isReversed.value && container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
        isReversed.value = true;
      }
    }, interval);
  }
}, { immediate: true });
watch(isReversed, () => {
  clearTimeout(awaitReverseTimeout);
  awaitReverseTimeout = setTimeout(() => awaitReverseTimeout = undefined, props.reverseTimeout);
});

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="text-runner"
    @mouseenter="stopOnHover && (isHover = true)"
    @mouseleave="stopOnHover && (isHover = false)"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.text-runner {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}
</style>
