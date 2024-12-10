import type { CP_RGB, CP_RGBH } from './index.vue';
import type { CP_RGBA } from '~/components/ColorPicker/index.vue';

export function createAlphaSquare(size: number) {
  const canvas = document.createElement('canvas');
  const ctx: any = canvas.getContext('2d');
  const doubleSize = size * 2;
  canvas.width = doubleSize;
  canvas.height = doubleSize;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, doubleSize, doubleSize);
  ctx.fillStyle = '#ccd5db';
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  return canvas;
}

export function createLinearGradient(
  direction: 'l' | 'p',
  ctx: any,
  width: any,
  height: any,
  color1: any,
  color2: any
) {
  const isL = direction === 'l';
  const gradient = ctx.createLinearGradient(0, 0, isL ? width : 0, isL ? 0 : height);
  gradient.addColorStop(0.01, color1);
  gradient.addColorStop(0.99, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function rgba2hex({ r, g, b, a }: any, toUpper: boolean) {
  const change = (val: any) => ('0' + Number(val).toString(16)).slice(-2);
  const color = `#${change(r)}${change(g)}${change(b)}${a !== undefined && a !== 1 ? change(a) : ''}`;
  return toUpper ? color.toUpperCase() : color;
}
export function hex2rgba(hex: string): CP_RGBA {
  hex = hex.slice(1);
  const change = (val: string) => parseInt(val, 16) || 0;
  return {
    r: change(hex.slice(0, 2)),
    g: change(hex.slice(2, 4)),
    b: change(hex.slice(4, 6)),
    a: change(hex.slice(6, 8)) / 255
  };
}
export function rgb2rgba(rgba: any) {
  if (typeof rgba === 'string') {
    rgba = (/rgba?\((.*?)\)/.exec(rgba) || ['', '0,0,0,1'])[1].split(',');
    return {
      r: Number(rgba[0]) || 0,
      g: Number(rgba[1]) || 0,
      b: Number(rgba[2]) || 0,
      a: Number(rgba[3] ? rgba[3] : 1)
    };
  } else {
    return rgba;
  }
}

export function rgb2rgbHue(rgb: CP_RGB): CP_RGBH {
  let { r, g, b } = rgb;

  r /= 255;
  g /= 255;
  b /= 255;

  if (r === g && g === b) return { r: 255, g: 0, b: 0, h: 0 };

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = (g - b) / delta;
    } else if (max === g) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  if (!h || h === 360) return { r: 255, g: 0, b: 0, h: 0 };

  const hToC = (a: number) => {
    if (a > 360) a -= 360;
    else if (a < 0) a += 360;

    let c = 0;

    if (a < 60 || a > 299) c = 1;
    else if (59 < a && a < 120) c = 1 - ((a - 60) / 60);
    else if (119 < a && a < 240) c = 0;
    else if (240 < a && a < 300) c = (a - 240) / 60;

    return Math.ceil(c * 255);
  };

  return {
    h,
    r: hToC(h),
    g: hToC(h - 120),
    b: hToC(h + 120)
  };
}

export function rgb2hsv({ r, g, b }: any) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;

  if (max === min) {
    h = 0;
  } else if (max === r) {
    if (g >= b) {
      h = (60 * (g - b)) / delta;
    } else {
      h = (60 * (g - b)) / delta + 360;
    }
  } else if (max === g) {
    h = (60 * (b - r)) / delta + 120;
  } else if (max === b) {
    h = (60 * (r - g)) / delta + 240;
  }

  h = Math.floor(h);

  const s = parseFloat((max === 0 ? 0 : 1 - min / max).toFixed(2));
  const v = parseFloat(max.toFixed(2));

  return { h, s, v };
}
