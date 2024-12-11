<script lang="ts" setup>
import { rgba2hex, rgb2rgbHue, any2rgbahsv } from './composible';
import type { CP_Colors, CP_HSV, CP_RGB, CP_RGBA, CP_RGBAHSV, CP_RGBH } from './types';

import Saturation from './Saturation.vue';
import Hue from './Hue.vue';
import Alpha from './Alpha.vue';
import Preview from './Preview.vue';
import Box from './Box.vue';

type Props = {
  modelValue?: string;
  theme?: string;
  suckerHide?: boolean;
  suckerCanvas?: HTMLCanvasElement;
  suckerArea?: [number, number, number, number];
};
type Emits = {
  (e: 'update:modelValue', v: string): void;
  (e: 'changeColor', v: CP_Colors): void;
  (e: 'openSucker', v: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  color: '#000000',
  theme: 'dark',
  suckerHide: true
});
const emit = defineEmits<Emits>();

const modelRgba = ref('');
const modelHex = ref('');
const isPreventSelects = ref(false);
const hueColor = reactive<CP_RGBH>({
  r: 0,
  g: 0,
  b: 0,
  h: 0
});
const fullColorSpector = reactive<CP_RGBAHSV>({
  r: 0,
  g: 0,
  b: 0,
  a: 0,
  h: 0,
  s: 0,
  v: 0
});

const rgba = computed<CP_RGBA>(() => ({ r: fullColorSpector.r, g: fullColorSpector.g, b: fullColorSpector.b, a: fullColorSpector.a }));
const hsv = computed<CP_HSV>(() => ({ h: fullColorSpector.h, s: fullColorSpector.s, v: fullColorSpector.v }));
const rgbaStringShort = computed(() => `${fullColorSpector.r}, ${fullColorSpector.g}, ${fullColorSpector.b}, ${fullColorSpector.a}`);
const rgbaString = computed(() => `rgba(${rgbaStringShort.value})`);
const hexString = computed(() => rgba2hex(rgba.value, true));

initColorValue();
initHueColor();

watch(hexString, value => emit('update:modelValue', value));
watch(rgba, value => emit('changeColor', {
  rgba: value,
  hsv: hsv.value,
  hex: modelHex.value
}));

function setText() {
  modelHex.value = hexString.value;
  modelRgba.value = rgbaStringShort.value;
}
function handleInputFocus(status: boolean) {
  isPreventSelects.value = status;
}

function initColorValue() {
  Object.assign(fullColorSpector, any2rgbahsv(props.modelValue));
  setText();
}
function initHueColor() {
  const { r, g, b } = any2rgbahsv(props.modelValue);
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
}

function selectSaturation(color: CP_RGB) {
  const { r, g, b, h, s, v } = any2rgbahsv(color);
  Object.assign(fullColorSpector, { r, g, b, h, s, v });
  setText();
}
function selectHue(color: CP_RGBH) {
  Object.assign(hueColor, color);
  setText();
}
function selectAlpha(a: number) {
  fullColorSpector.a = a;
  setText();
}

function inputHex(color: string) {
  const { r, g, b, a, h, s, v } = any2rgbahsv(color);
  Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = color.toUpperCase();
  modelRgba.value = rgbaStringShort.value;
}
function inputRgba(color: string) {
  const { r, g, b, a, h, s, v } = any2rgbahsv(color);
  Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = hexString.value;
  modelRgba.value = color;
}
</script>

<template>
  <div class="color-picker">
    <Saturation
      class="color-picker__saturation"
      :color="fullColorSpector"
      :hue-color="hueColor"
      :prevent-select="isPreventSelects"
      @select="selectSaturation"
    />
    <Hue
      class="color-picker__hue"
      :rgbh="hueColor"
      @select="selectHue"
    />
    <Alpha
      class="color-picker__alpha"
      :rgba="rgba"
      @select="selectAlpha"
    />
    <Preview
      class="color-picker__preview"
      :color="rgbaString"
      :width="198"
    />
    <Box
      class="color-picker__hex"
      name="HEX"
      :color="modelHex"
      @input-color="inputHex"
      @input-focus="handleInputFocus"
    />
    <Box
      class="color-picker__rgba"
      name="RGBA"
      :color="modelRgba"
      @input-color="inputRgba"
      @input-focus="handleInputFocus"
    />
  </div>
</template>

<style lang="scss" scoped>
.color-picker {
  display: grid;
  grid-template-columns: 152px 15px 15px;
  grid-template-areas:
    "SATURATION HUE ALPLA"
    "PREVIEW PREVIEW PREVIEW"
    "HEX HEX HEX"
    "RGBA RGBA RGBA";
  gap: 8px;
  width: max-content;
  padding: 10px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);

  &__saturation {
    grid-area: SATURATION;
  }
  &__hue {
    grid-area: HUE;
  }
  &__alpha {
    grid-area: ALPLA;
  }
  &__preview {
    grid-area: PREVIEW;
  }
  &__hex {
    grid-area: HEX;
  }
  &__rgba {
    grid-area: RGBA;
  }
}
</style>
