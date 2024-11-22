import type { ComponentInternalInstance } from '@vue/runtime-core';
import clientGetter from '../helpers/clientGetter';
import type { ModuleNestedKeys } from '../types';
// @ts-ignore
import type { ModuleMetaBlocks } from '../meta/themesStructure';
import { getCurrentInstance, onMounted, onUnmounted } from '#imports';

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
    const scopeId = getComponentId(currentInstance);
    if (client.checkScopeRegistration(scopeId))
      console.warn(`useThemeBlock is already used in [${currentInstance.type.__file}]. The styles of the last called function will be used. Only one call is allowed.`);
    client.registerScopeStyles(block, scopeId);
  });
  onUnmounted(() => {
    client.unregisterScopeStyles(getComponentId(currentInstance));
  });
}
