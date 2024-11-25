import { h, type Reactive, render } from 'vue';
import type {
  ModuleSandboxComponents,
  ModuleSandboxContextMenuItem,
  ModuleSandboxMousePosition,
  ModuleThemeRootReturn
} from '../types';
import unwrap from '../helpers/unwrap';
import ContextMenu from '../components/subs/ContextMenu.vue';
import ModuleSandbox from '../components/subs/ModuleSandbox.vue';
import type { Client } from './Client';
import { markRaw, reactive } from '#imports';

const CONTEXT_MENU_ID = 'context-menu';

export class Sandbox {
  private readonly id: string;
  private readonly components = reactive<ModuleSandboxComponents>([]);

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

  closeContextMenu(): void {
    const contextMenuComponentIndex = this.components.findIndex(component => component.id === CONTEXT_MENU_ID);
    if (contextMenuComponentIndex !== -1) this.components.splice(contextMenuComponentIndex, 1);
  }

  openContextMenu(event: MouseEvent, theme: ModuleThemeRootReturn): void {
    this.closeContextMenu();
    const clickPosition: ModuleSandboxMousePosition = { x: event.pageX, y: event.pageY };
    const isSelectedTheme = unwrap.get(this.ctx.getSelectedThemeName()) === theme.name;

    this.components.push({
      id: CONTEXT_MENU_ID,
      component: markRaw(ContextMenu),
      transitionName: 'fade',
      props: {
        clickPosition,
        items: <ModuleSandboxContextMenuItem[]>[
          {
            title: isSelectedTheme ? 'Тема активна' : 'Выбрать тему',
            isDisabled: () => isSelectedTheme,
            icon: isSelectedTheme ? 'Check' : undefined,
            iconColor: 'var(--contextMenuStatusActive)',
            action: () => this.ctx.selectTheme(theme.name)
          },
          {
            title: 'Выбрать как тёмную тему',
            action: () => console.log('Тема выбрана!')
          }
        ]
      },
      emits: {
        close: () => this.closeContextMenu()
      }
    });
  }
}
