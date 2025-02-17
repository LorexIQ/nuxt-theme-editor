import type { ComponentInternalInstance } from '@vue/runtime-core';
import useClient from '../helpers/client/useClient';
import type { ModuleDefaultBlockKeys, ModuleUseThemeBlockConfig } from '../types';
import unwrap from '../helpers/client/unwrap';
import { computed, getCurrentInstance, onMounted, onUnmounted } from '#imports';

function getComponentId(instance: ComponentInternalInstance) {
  const instanceType = instance.type as any;
  const subTree = instance.subTree;
  const scopeId = `data-v-${instanceType.__hmrId}`;

  if (!subTree.scopeId) {
    if (subTree.type === Symbol.for('v-fgt')) {
      for (const child of subTree.children as any[]) {
        child.el?.setAttribute?.(scopeId, '');
      }
    } else {
      subTree.el?.setAttribute?.(scopeId, '');
    }
  }

  return scopeId;
}
function registerComponentModificator(instance: ComponentInternalInstance, mod: string) {
  const modAttr = mod.length ? `te-mod-${mod}` : 'te-no-mod';

  const subTree = instance.subTree;

  if (subTree.type === Symbol.for('v-fgt')) {
    for (const child of subTree.children as any[]) {
      child.el?.setAttribute?.(modAttr, '');
    }
  } else {
    subTree.el?.setAttribute?.(modAttr, '');
  }
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

  onMounted(() => {
    registerComponentModificator(currentInstance, _config.pathModificator);
    client.createScopeStyles(getComponentId(currentInstance), prepareBlock, blockStyles, _config.pathModificator);
  });
  onUnmounted(() => client.deleteScopeStyles(getComponentId(currentInstance), prepareBlock, _config.pathModificator));

  return blockStyles;
}
