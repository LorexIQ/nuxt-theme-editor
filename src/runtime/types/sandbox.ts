import type { Component } from 'vue';
import type { ModuleIcons } from './themes';

export type ModuleSandboxComponent = {
  id: string;
  component: Component;
  transitionName?: string;
  props?: { [name: string]: any };
  emits?: { [name: string]: (e: any) => any };
};
export type ModuleSandboxComponents = ModuleSandboxComponent[];

export type ModuleSandboxMousePosition = { x: number; y: number };
export type ModuleSandboxContextMenuItem = {
  title: string;
  icon: ModuleIcons;
  iconColor?: string;
  isDisabled?: () => boolean;
  action: () => void;
};

export type ModuleSandboxSize = {
  width: number;
  height: number;
};
