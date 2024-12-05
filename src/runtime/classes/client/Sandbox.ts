import { h, type Reactive, render } from 'vue';
import type {
  ModuleClient,
  ModuleOptionsExtend,
  ModuleSandboxComponents,
  ModuleSandboxContextMenuItem,
  ModuleSandboxHandlers,
  ModuleSandboxMousePosition,
  ModuleSandboxSize,
  ModuleThemeRootReturn
} from '../../types';
import ContextMenu from '../../components/shared/ContextMenu.vue';
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

  openThemeContextMenu(event: MouseEvent, theme: ModuleThemeRootReturn, handlers?: ModuleSandboxHandlers): void {
    handlers;
    this.closeContextMenu();
    const router = this.ctx.getRouter();
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
        tipText: 'Select an action',
        items: <ModuleSandboxContextMenuItem[]>[
          {
            title: isSelectedTheme ? 'Theme is active' : 'Select a theme',
            isDisabled: () => isSelectedTheme,
            icon: isSelectedTheme ? 'Check' : 'Palette',
            iconColor: isSelectedTheme ? 'var(--contextMenuIconSuccess)' : undefined,
            action: () => this.ctx.setTheme(theme.id)
          },
          {
            title: isSelectedLightTheme ? 'Light theme is set' : 'Set as light theme',
            isDisabled: () => isSelectedLightTheme,
            icon: isSelectedLightTheme ? 'Check' : 'Sun',
            iconColor: isSelectedLightTheme ? 'var(--contextMenuIconSuccess)' : undefined,
            action: () => this.ctx.setLightTheme(theme.id)
          },
          {
            title: isSelectedDarkTheme ? 'Dark theme is set' : 'Set as dark theme',
            isDisabled: () => isSelectedDarkTheme,
            icon: isSelectedDarkTheme ? 'Check' : 'Moon',
            iconColor: isSelectedDarkTheme ? 'var(--contextMenuIconSuccess)' : undefined,
            action: () => this.ctx.setDarkTheme(theme.id)
          },
          {
            title: 'Create theme copy',
            icon: 'Palette2',
            action: () => router.push(`newTheme?parentThemeId=${theme.id}`, 'tab-fade-lr')
          },
          {
            title: 'Edit info',
            icon: 'PaperPen',
            action: () => router.push(`editThemeInfo?themeId=${theme.id}`, 'tab-fade-lr'),
            isVisible: () => theme.type === 'local'
          },
          {
            title: 'Edit styles',
            icon: 'WordsPen',
            action: () => router.push(`editThemeStyles?themeId=${theme.id}`, 'tab-fade-lr'),
            isVisible: () => theme.type === 'local'
          },
          {
            title: 'Delete theme',
            titleColor: 'var(--contextMenuIconError)',
            icon: 'Bin',
            iconColor: 'var(--contextMenuIconError)',
            action: () => router.push(`deleteTheme?themeId=${theme.id}`, 'tab-fade-lr'),
            isVisible: () => theme.type === 'local'
          }
        ]
      },
      emits: {
        close: () => this.closeContextMenu()
      }
    });
  }
}
