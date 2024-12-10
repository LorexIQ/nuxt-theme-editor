<template>
  <div
    class="hu-color-picker"
    :class="{ light: isLightTheme }"
    :style="{ width: totalWidth + 'px' }"
  >
    <div class="color-set">
      <Saturation
        :hsv="hsv"
        :is-focus="isFocus"
        :hue-color="hueColor"
        :size="hueHeight"
        @select="selectSaturation"
      />
      <Hue
        :color="hueColor"
        :width="hueWidth"
        :height="hueHeight"
        @select="selectHue"
      />
      <Alpha
        :rgba="rgba"
        :width="hueWidth"
        :height="hueHeight"
        @select="selectAlpha"
      />
    </div>
    <div class="color-show">
      <Preview
        :color="rgbaString"
        :width="totalWidth"
      />
    </div>
    <Box
      name="HEX"
      :color="modelHex"
      @input-color="inputHex"
      @input-focus="handleFocus"
    />
    <Box
      name="RGBA"
      :color="modelRgba"
      @input-color="inputRgba"
      @input-focus="handleFocus"
    />
  </div>
  {{ colorVal }} {{ hueColor }} {{ isFocus }}
</template>

<script lang="ts" setup>
import { rgba2hex, hex2rgba, rgb2rgba, rgb2hsv, rgb2rgbHue } from './composible';

import Saturation from './Saturation.vue';
import Hue from './Hue.vue';
import Alpha from './Alpha.vue';
import Preview from './Preview.vue';
import Box from './Box.vue';

export type CP_STYLES_X = {
  x: number;
};
export type CP_STYLES_Y = {
  y: number;
};
export type CP_STYLES_LEFT = {
  left: string;
};
export type CP_STYLES_TOP = {
  top: string;
};
export type CP_STYLES_XY = CP_STYLES_X & CP_STYLES_Y;
export type CP_STYLES_POS = CP_STYLES_LEFT & CP_STYLES_TOP;

export type CP_RGB = {
  r: number;
  g: number;
  b: number;
};
export type CP_RGBH = CP_RGB & {
  h: number;
};
export type CP_RGBA = CP_RGB & {
  a: number;
};
export type CP_HSV = {
  h: number;
  s: number;
  v: number;
};
export type CP_HEX = string;
export type CP_Colors = {
  rgba: CP_RGBA;
  hsv: CP_HSV;
  hex: CP_HEX;
};

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

const hueWidth = ref(15);
const hueHeight = ref(152);
const modelRgba = ref('');
const modelHex = ref('');
const isFocus = ref(false);
const hueColor = reactive<CP_RGBH>({
  r: 0,
  g: 0,
  b: 0,
  h: 0
});
const colorVal = reactive({
  r: 0,
  g: 0,
  b: 0,
  a: 0,
  h: 0,
  s: 0,
  v: 0
});

const isLightTheme = computed(() => props.theme === 'light');
const totalWidth = computed(() => hueHeight.value + (hueWidth.value + 8) * 2);
const rgba = computed<CP_RGBA>(() => ({ r: colorVal.r, g: colorVal.g, b: colorVal.b, a: colorVal.a }));
const hsv = computed<CP_HSV>(() => ({ h: colorVal.h, s: colorVal.s, v: colorVal.v }));
const rgbaStringShort = computed(() => `${colorVal.r}, ${colorVal.g}, ${colorVal.b}, ${colorVal.a}`);
const rgbaString = computed(() => `rgba(${rgbaStringShort.value})`);
const hexString = computed(() => rgba2hex(rgba.value, true));

Object.assign(colorVal, setColorValue(props.modelValue));
setText();
initHueColor();

watch(hexString, value => emit('update:modelValue', value));
watch(rgba, value => emit('changeColor', {
  rgba: value,
  hsv: hsv.value,
  hex: modelHex.value
}));

function setColorValue(color: any) {
  let rgba: any = { r: 0, g: 0, b: 0, a: 1 };

  if (/#/.test(color)) {
    rgba = hex2rgba(color);
  } else if (/rgb/.test(color)) {
    rgba = rgb2rgba(color);
  } else if (typeof color === 'string') {
    rgba = rgb2rgba(`rgba(${color})`);
  } else if (Object.prototype.toString.call(color) === '[object Object]') {
    rgba = color;
  }

  const { r, g, b, a } = rgba;
  const { h, s, v } = rgb2hsv(rgba);
  return { r, g, b, a: a === undefined ? 1 : a, h, s, v };
}
function setText() {
  modelHex.value = hexString.value;
  modelRgba.value = rgbaStringShort.value;
}
function selectSaturation(color: CP_RGB) {
  const { r, g, b, h, s, v } = setColorValue(color);
  Object.assign(colorVal, { r, g, b, h, s, v });
  setText();
}
function handleFocus(status: boolean) {
  isFocus.value = status;
}
function initHueColor() {
  const { r, g, b } = setColorValue(props.modelValue);
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
}
function selectHue(color: CP_RGBH) {
  Object.assign(hueColor, color);
  setText();
}
function selectAlpha(a: number) {
  colorVal.a = a;
  setText();
}
function inputHex(color: string) {
  const { r, g, b, a, h, s, v } = setColorValue(color);
  Object.assign(colorVal, { r, g, b, a, h, s, v });
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = color.toUpperCase();
  modelRgba.value = rgbaStringShort.value;
}
function inputRgba(color: string) {
  const { r, g, b, a, h, s, v } = setColorValue(color);
  Object.assign(colorVal, { r, g, b, a, h, s, v });
  console.log(rgb2rgbHue({ r, g, b }));
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = hexString.value;
  modelRgba.value = color;
}

// function openSucker(isOpen: boolean) {
//   emit('openSucker', isOpen);
// }
// function selectSucker(color: string) {
//   Object.assign(colorVal, setColorValue(color));
//   setText();
//
//   nextTick(() => {
//     this.$refs.saturation.renderColor();
//     this.$refs.saturation.renderSlide();
//     this.$refs.hue.renderSlide();
//   });
// }
// function selectColor(color: string) {
//   Object.assign(colorVal, setColorValue(color));
//   setText();
//
//   nextTick(() => {
//     this.$refs.saturation.renderColor();
//     this.$refs.saturation.renderSlide();
//     this.$refs.hue.renderSlide();
//   });
// }
</script>

<style lang="scss" scoped>
.hu-color-picker {
  padding: 10px;
  background: #1d2024;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  z-index: 1;

  canvas {
    vertical-align: top;
  }
  .color-set {
    display: flex;
  }
  .color-show {
    margin-top: 8px;
    display: flex;
    height: 30px;
  }
}
</style>
