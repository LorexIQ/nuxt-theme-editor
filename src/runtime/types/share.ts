import type pagesMeta from '../assets/pagesMeta';
import type iconsConnector from '../assets/iconsConnector';
import type { Client } from '../classes/client/Client';
import type { Sandbox } from '../classes/client/Sandbox';
import type { Router } from '../classes/client/Router';
import type { Server } from '../classes/server/Server';
import type { MetaFiles } from '../classes/server/MetaFiles';

export type ModulePage = { name: string; title: string };
export type ModulePageAnimations = 'tab-fade-lr' | 'tab-fade-rl' | undefined;
export type ModulePagesNames = (typeof pagesMeta extends { name: infer U }[] ? U : never) | string;
export type ModuleIcons = keyof typeof iconsConnector;

export type ModuleClient = Client;
export type ModuleClientSandbox = Sandbox;
export type ModuleClientRouter = Router;
export type ModuleServer = Server;
export type ModuleServerMetaFiles = MetaFiles;
