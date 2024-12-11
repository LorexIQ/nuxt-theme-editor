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
export type CP_RGBAHSV = CP_RGBA & CP_HSV;
export type CP_Colors = {
  rgba: CP_RGBA;
  hsv: CP_HSV;
  hex: CP_HEX;
};
