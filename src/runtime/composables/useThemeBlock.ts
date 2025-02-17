import type { ComponentInternalInstance } from '@vue/runtime-core';
import useClient from '../helpers/client/useClient';
import type { ModuleDefaultBlockKeys, ModuleUseThemeBlockConfig } from '../types';
import unwrap from '../helpers/client/unwrap';
import { computed, getCurrentInstance, onMounted, onUnmounted } from '#imports';

function getComponentId(instance: ComponentInternalInstance, mod: string) {
  const instanceType = instance.type as any;
  const subTree = instance.subTree;
  const scopeId = `te-${instanceType.__hmrId}-${mod.length ? `mod-${mod}` : 'no-mod'}`;

  if (subTree.type === Symbol.for('v-fgt')) {
    for (const child of subTree.children as any[]) {
      child.el?.setAttribute?.(scopeId, '');
    }
  } else {
    subTree.el?.setAttribute?.(scopeId, '');
  }

  return scopeId;
}

export default function useBlock(block: ModuleDefaultBlockKeys, config: ModuleUseThemeBlockConfig = {}) {
  const _config: Required<ModuleUseThemeBlockConfig> = {
    inheritanceParent: config.inheritanceParent ?? false,
    pathModificator: config.pathModificator ?? ''
  };

  const client = useClient().value;
  const prepareBlock = block + (_config.pathModificator.length ? `.${_config.pathModificator}` : '');
  const blockStyles = computed(() => unwrap.get(client.getSelectedTheme()?.getPreparedStylesBlock(prepareBlock, _config.inheritanceParent)) ?? {});
  const currentInstance = getCurrentInstance()!;

  onMounted(() => client.createScopeStyles(getComponentId(currentInstance, _config.pathModificator), prepareBlock, blockStyles));
  onUnmounted(() => client.deleteScopeStyles(getComponentId(currentInstance, _config.pathModificator), prepareBlock));

  return blockStyles;
}
