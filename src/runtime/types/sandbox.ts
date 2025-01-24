import type { Component } from 'vue';
import type { ModuleIcons } from './share';

export type ModuleSandboxComponent = {
  id: string;
  component: Component;
  transitionName?: string;
  props?: { [name: string]: any };
  emits?: { [name: string]: (e: any) => any };
};
export type ModuleSandboxComponents = ModuleSandboxComponent[];

export type ModuleSandboxMousePosition = { x: number; y: number };
export type ModuleSandboxContextMenuItemAction = (event: MouseEvent) => any;
export type ModuleSandboxContextMenuItem = {
  title: string;
  titleColor?: string;
  icon: ModuleIcons;
  iconColor?: string;
  action: ModuleSandboxContextMenuItemAction;
  isDisabled?: () => boolean;
  isVisible?: () => boolean;
};

export type ModuleSandboxSize = {
  width: number;
  height: number;
};
export type ModuleSandboxHandlers<T> = { [name: string]: (payload: T) => any };
