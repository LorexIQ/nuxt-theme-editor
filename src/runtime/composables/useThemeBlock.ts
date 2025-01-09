import type { ComponentInternalInstance } from '@vue/runtime-core';
import useClient from '../helpers/client/useClient';
import type { ModuleDefaultBlockKeys } from '../types';
import { getCurrentInstance, onMounted, onUnmounted } from '#imports';

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

export default function useBlock(block: ModuleDefaultBlockKeys) {
  const client = useClient().value;
  const blockStyles = client.getStylesByPath(block);
  const currentInstance = getCurrentInstance()!;

  onMounted(() => {
    const scopeId = getComponentId(currentInstance);
    if (client.checkScopeRegistration(scopeId, block)) console.warn(`useThemeBlock('${block}') is already used in [${currentInstance.type.__file}]. Registration will be skipped.`);
    client.registerScopeStyles(scopeId, block, blockStyles);
  });
  onUnmounted(() => {
    client.unregisterScopeStyles(getComponentId(currentInstance), block);
  });

  return blockStyles;
}
