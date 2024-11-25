import { h, type Reactive, render } from 'vue';
import type {
  ModuleSandboxComponents,
  ModuleSandboxContextMenuItem,
  ModuleSandboxMousePosition,
  ModuleSandboxSize,
  ModuleThemeRootReturn
} from '../types';
import ContextMenu from '../components/subs/ContextMenu.vue';
import ModuleSandbox from '../components/subs/ModuleSandbox.vue';
import type { Client } from './Client';
import { markRaw, reactive } from '#imports';

const CONTEXT_MENU_ID = 'context-menu';

export class Sandbox {
  private readonly id: string;
  private readonly components = reactive<ModuleSandboxComponents>([]);
  private readonly boxSize = reactive<ModuleSandboxSize>({ width: 0, height: 0 });

  constructor(private readonly ctx: Client) {
    this.id = ctx.getConfig().keys.sandbox;
    this._initSandbox();
  }

  private _initSandbox(): void {
    if (import.meta.client) {
      const nuxtElement = document.getElementById('__nuxt');
      const sandboxElement = document.getElementById(this.id);

      if (nuxtElement && !sandboxElement) {
        const container = document.createElement('div');
        nuxtElement.insertAdjacentElement('afterend', container);

        render(h(ModuleSandbox, { sandbox: this }), container);
        container.replaceWith(...container.childNodes);
      }
    }
  }

  getId(): string {
    return this.id;
  }

  getComponents(): Reactive<ModuleSandboxComponents> {
    return this.components;
  }

  getBoxSize(): ModuleSandboxSize {
    return this.boxSize;
  }

  setBoxSize(event: ModuleSandboxSize) {
    this.boxSize.width = event.width;
    this.boxSize.height = event.height;
  }

  closeContextMenu(): void {
    const contextMenuComponentIndex = this.components.findIndex(component => component.id === CONTEXT_MENU_ID);
    if (contextMenuComponentIndex !== -1) this.components.splice(contextMenuComponentIndex, 1);
  }

  openContextMenu(event: MouseEvent, theme: ModuleThemeRootReturn): void {
    this.closeContextMenu();
    const clickPosition: ModuleSandboxMousePosition = { x: event.pageX, y: event.pageY };
    const isSelectedTheme = this.ctx.getSelectedTheme().name === theme.name;
    const isSelectedLightTheme = this.ctx.getSelectedLightThemeName() === theme.name;
    const isSelectedDarkTheme = this.ctx.getSelectedDarkThemeName() === theme.name;

    this.components.push({
      id: CONTEXT_MENU_ID,
      component: markRaw(ContextMenu),
      transitionName: 'fade',
      props: {
        clickPosition,
        sandboxSize: this.boxSize,
        items: <ModuleSandboxContextMenuItem[]>[
          {
            title: isSelectedTheme ? 'Тема активна' : 'Выбрать тему',
            isDisabled: () => isSelectedTheme,
            icon: isSelectedTheme ? 'Check' : undefined,
            iconColor: 'var(--contextMenuStatusActive)',
            action: () => this.ctx.selectTheme(theme.name)
          },
          {
            title: isSelectedLightTheme ? 'Назначена светлой темой' : 'Назначить светлой темой',
            isDisabled: () => isSelectedLightTheme,
            icon: isSelectedLightTheme ? 'Check' : undefined,
            iconColor: 'var(--contextMenuStatusActive)',
            action: () => this.ctx.selectLightTheme(theme.name)
          },
          {
            title: isSelectedDarkTheme ? 'Назначена тёмной темой' : 'Назначить тёмной темой',
            isDisabled: () => isSelectedDarkTheme,
            icon: isSelectedDarkTheme ? 'Check' : undefined,
            iconColor: 'var(--contextMenuStatusActive)',
            action: () => this.ctx.selectDarkTheme(theme.name)
          }
        ]
      },
      emits: {
        close: () => this.closeContextMenu()
      }
    });
  }
}