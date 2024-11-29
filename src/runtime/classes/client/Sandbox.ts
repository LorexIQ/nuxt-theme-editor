import { h, type Reactive, render } from 'vue';
import type {
  ModuleClient,
  ModuleOptionsExtend,
  ModuleSandboxComponents,
  ModuleSandboxContextMenuItem,
  ModuleSandboxMousePosition,
  ModuleSandboxSize,
  ModuleThemeRootReturn
} from '../../types';
import ContextMenu from '../../components/features/ContextMenu.vue';
import ModuleSandbox from '../../components/views/ModuleSandbox.vue';
import { markRaw, reactive } from '#imports';

const CONTEXT_MENU_ID = 'context-menu';

export class Sandbox {
  private readonly config: ModuleOptionsExtend;
  private readonly id: string;
  private readonly components = reactive<ModuleSandboxComponents>([]);
  private readonly boxSize = reactive<ModuleSandboxSize>({ width: 0, height: 0 });

  constructor(private readonly ctx: ModuleClient) {
    this.config = this.ctx.getConfig();
    this.id = this.config.keys.sandbox;
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

  openSystemThemeContextMenu(event: MouseEvent, theme: ModuleThemeRootReturn): void {
    this.closeContextMenu();
    const clickPosition: ModuleSandboxMousePosition = { x: event.pageX, y: event.pageY };
    const isSelectedTheme = this.ctx.getSelectedTheme()?.id === theme.id;
    const isSelectedLightTheme = this.ctx.getSelectedLightThemeId() === theme.id;
    const isSelectedDarkTheme = this.ctx.getSelectedDarkThemeId() === theme.id;

    this.components.push({
      id: CONTEXT_MENU_ID,
      component: markRaw(ContextMenu),
      transitionName: 'fade',
      props: {
        clickPosition,
        sandboxSize: this.boxSize,
        tipText: 'Выберите действие',
        items: <ModuleSandboxContextMenuItem[]>[
          {
            title: isSelectedTheme ? 'Тема активна' : 'Выбрать тему',
            isDisabled: () => isSelectedTheme,
            icon: isSelectedTheme ? 'Check' : 'Palette',
            iconColor: isSelectedTheme ? 'var(--contextMenuIconActive)' : undefined,
            action: () => this.ctx.setTheme(theme.id)
          },
          {
            title: isSelectedLightTheme ? 'Назначена светлой темой' : 'Назначить светлой темой',
            isDisabled: () => isSelectedLightTheme,
            icon: isSelectedLightTheme ? 'Check' : 'Sun',
            iconColor: isSelectedLightTheme ? 'var(--contextMenuIconActive)' : undefined,
            action: () => this.ctx.setLightTheme(theme.id)
          },
          {
            title: isSelectedDarkTheme ? 'Назначена тёмной темой' : 'Назначить тёмной темой',
            isDisabled: () => isSelectedDarkTheme,
            icon: isSelectedDarkTheme ? 'Check' : 'Moon',
            iconColor: isSelectedDarkTheme ? 'var(--contextMenuIconActive)' : undefined,
            action: () => this.ctx.setDarkTheme(theme.id)
          },
          {
            title: 'Создать копию темы',
            icon: 'Palette2',
            action: () => this.ctx.getRouter().push(`newTheme?parentThemeId=${theme.id}`, 'tab-fade-lr')
          },
          {
            title: '404',
            icon: 'Palette2',
            action: () => this.ctx.getRouter().push('newT123heme', 'tab-fade-lr')
          }
        ]
      },
      emits: {
        close: () => this.closeContextMenu()
      }
    });
  }
}