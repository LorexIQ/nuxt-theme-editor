import type { UnwrapRefSimple } from '@vue/reactivity';
import type { Component } from 'vue';
import type pagesMeta from '../assets/pagesMeta';
import type iconsConnector from '../assets/iconsConnector';
import type { Client } from '../classes/client/Client';
import type { Router } from '../classes/client/Router';
import type { Sandbox } from '../classes/client/Sandbox';
import type { Theme } from '../classes/client/Theme';
import type { Server } from '../classes/server/Server';
import type { MetaFiles } from '../classes/server/MetaFiles';
// @ts-ignore
import type { ModuleMetaBlocks } from '../meta/themesStructure';
import type { ModuleHelpersNestedKeys, ModuleHelpersStringKeys } from './helpers';
import type { ModuleObject } from './index';

export type ModulePage = {
  name: string;
  title: string;
  component: Component;
};
export type ModulePageAnimations = 'tab-fade-lr' | 'tab-fade-rl' | undefined;
export type ModulePagesNames = (ReturnType<typeof pagesMeta> extends { name: infer U }[] ? U : never) | string;
export type ModuleIcons = keyof typeof iconsConnector;
export type ModuleErrorType = 'INFO' | 'TIP' | 'WARN' | 'ERROR';
export type ModuleUUID = `${string}-${string}-${string}-${string}-${string}-${string}-${string}-${string}-${string}-${string}`;
export type ModuleErrorMessage = {
  id: number;
  page: ModulePagesNames[];
  type: ModuleErrorType;
  message: string;
  title?: string;
  uuid?: string;
};
export type ModuleServerError = {
  statusCode: number;
  message: string;
};

export type ModuleClient = Client;
export type ModuleClientRouter = Router;
export type ModuleClientSandbox = Sandbox;
export type ModuleServer = Server;
export type ModuleServerMetaFiles = MetaFiles;

export type ModuleTheme = UnwrapRefSimple<ModuleThemeRef>;
export type ModuleThemeRef = Theme;

export type ModulePathsCache = ModuleObject<(number | string)[]>;
export type ModuleDefaultBlockKeys = ModuleHelpersNestedKeys<ModuleMetaBlocks> | string;
export type ModuleDefaultStyleKeys = ModuleHelpersStringKeys<ModuleMetaBlocks> | string;
export type ModuleDefaultKeys = ModuleDefaultBlockKeys | ModuleDefaultStyleKeys;
