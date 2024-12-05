import type { Component } from 'vue';
import type { ModuleIcons } from './share';
import type { ModuleThemeRootReturn } from '~/src/runtime/types/themes';

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
  action: () => void;
  iconColor?: string;
  isDisabled?: () => boolean;
  isVisible?: () => boolean;
};

export type ModuleSandboxSize = {
  width: number;
  height: number;
};
export type ModuleSandboxHandlers = { [name: string]: (theme: ModuleThemeRootReturn) => any };
