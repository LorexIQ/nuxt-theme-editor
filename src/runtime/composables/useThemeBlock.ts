import type { ComponentInternalInstance } from '@vue/runtime-core';
import clientGetter from '../helpers/clientGetter';
import type { ModuleNestedKeys } from '../types';
import type { ModuleMetaBlocks } from '../meta/themesStructure';
import { getCurrentInstance } from '#imports';

function getComponentId(instance: ComponentInternalInstance) {
  const instanceType = instance.type as any;
  const subTree = instance.subTree;
  const scopeId = `data-v-${instanceType.__hmrId}`;

  if (!subTree.scopeId) {
    if (subTree.type === Symbol.for('v-fgt')) {
      for (const child of subTree.children as any[]) {
        child.el?.setAttribute(scopeId, '');
      }
    } else {
      subTree.el?.setAttribute(scopeId, '');
    }
  }

  return scopeId;
}

export default function useBlock(block: ModuleNestedKeys<ModuleMetaBlocks>) {
  const client = clientGetter().value;
  const currentInstance = getCurrentInstance()!;

  onMounted(() => {
    client.registerScopeStyles(block, getComponentId(currentInstance));
  });
  onUnmounted(() => {
    client.unregisterScopeStyles(getComponentId(currentInstance));
  });
}
