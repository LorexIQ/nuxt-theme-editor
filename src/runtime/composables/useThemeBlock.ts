import type { ComponentInternalInstance } from '@vue/runtime-core';
import useClient from '../helpers/client/useClient';
import type { ModuleDefaultBlockKeys, ModuleUseThemeBlockConfig } from '../types';
import unwrap from '../helpers/client/unwrap';
import {
  computed,
  getCurrentInstance, onBeforeMount,
  onUnmounted, onUpdated, watch
} from '#imports';

function mountAndGetComponentId(instance: ComponentInternalInstance, mod: string) {
  const instanceType = instance.type as any;
  const scopeId = `te-${instanceType.__hmrId}-${mod.length ? `mod-${mod}` : 'no-mod'}`;

  if (instance.vnode.component && !instance.vnode.component.attrs[scopeId]) {
    instance.vnode.component.attrs[scopeId] = '';
  }
  if (instance?.subTree?.el) {
    instance.subTree.el.setAttribute?.(scopeId, '');
  }

  return scopeId;
}

export default function useBlock(block: ModuleDefaultBlockKeys, config: ModuleUseThemeBlockConfig = {}) {
  const _config: Required<ModuleUseThemeBlockConfig> = {
    inheritanceParent: config.inheritanceParent ?? false,
    pathModificator: config.pathModificator ?? '',
    renderTriggers: config.renderTriggers ?? []
  };

  const client = useClient().value;
  const prepareBlock = block + (_config.pathModificator.length ? `.${_config.pathModificator}` : '');
  const blockStyles = computed(() => unwrap.get(client.getSelectedTheme()?.getPreparedStylesBlock(prepareBlock, _config.inheritanceParent)) ?? {});
  const currentInstance = getCurrentInstance()!;

  onBeforeMount(() => client.createScopeStyles(mountAndGetComponentId(currentInstance, _config.pathModificator), prepareBlock, blockStyles));
  watch(_config.renderTriggers, () => mountAndGetComponentId(currentInstance, _config.pathModificator));
  onUpdated(() => mountAndGetComponentId(currentInstance, _config.pathModificator));
  onUnmounted(() => {
    const targetNode = currentInstance.vnode.el!;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.removedNodes.length) {
          for (const node of mutation.removedNodes) {
            if (node === targetNode) {
              client.deleteScopeStyles(mountAndGetComponentId(currentInstance, _config.pathModificator), prepareBlock);
              observer.disconnect();
            }
          }
        }
      }
    });

    if (targetNode.parentNode) observer.observe(targetNode.parentNode, { childList: true });
    else client.deleteScopeStyles(mountAndGetComponentId(currentInstance, _config.pathModificator), prepareBlock);
  });

  return blockStyles;
}
