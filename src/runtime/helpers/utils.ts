import type { ModuleObject, ModuleThemeCleanedStyles } from '../types';

class Utils {
  private lastUUID: string;

  constructor() {
    this.lastUUID = this.generateRandomString();
  }

  mergeThemes<T extends ModuleThemeCleanedStyles>(target: Record<any, any>, template: T[]): T[] {
    const blockValidate = (block?: any): boolean => {
      return block
        && typeof block.id === 'string'
        && typeof block.settings === 'object'
        && Array.isArray(block.styles);
    };
    const objectMerger = <TR extends Record<string, any>>(_target: TR, _template: TR): TR => {
      if (blockValidate(_target)) return this.copyObject(_template);

      return Object.keys(_template).reduce((acc, key) => ({
        ...acc,
        [key]: _target[key] ?? _template[key]
      }), {} as TR);
    };
    const arrayMerger = <TR extends T>(_target: Record<any, any>, _template: TR[]): TR[] => {
      if (!Array.isArray(_target)) return this.copyObject(_template);

      const result: TR[] = [];

      for (let i = 0; i < Object.values(_template).length; i++) {
        const block = _template[i];

        if (blockValidate(block)) {
          const targetBlock = _target.find((tBlock: T) => tBlock.id === block.id);

          result.push({ ...block, styles: arrayMerger(targetBlock?.styles, block.styles as any) });
        } else {
          result.push(objectMerger(_target[i], block));
        }
      }

      return result;
    };

    return arrayMerger(target, template);
  }

  mergeObjects<T>(target: Record<any, any>, template: T): T {
    const merger = <TR>(_target: Record<any, any>, _template: TR, level = 0): TR => {
      if (Array.isArray(_template)) {
        if (!Array.isArray(_target)) _target = [];

        return _template.map((templateItem, index) => {
          if (typeof templateItem === 'object' && templateItem !== null) return merger(_target[index] || {}, templateItem, level + 1);
          else return _target[index] !== undefined ? _target[index] : templateItem;
        }) as TR;
      }

      if (typeof _template === 'object' && _template !== null) {
        if (typeof _target !== 'object' || _target === null) _target = {};

        const result: Record<string, any> = {};

        for (const key in _template) {
          if (['id', 'settings'].includes(key) && level) result[key] = _template[key];
          else result[key] = merger(_target[key], _template[key], level + 1);
        }

        return result as TR;
      }

      return _target !== undefined ? _target : _template as TR;
    };

    return merger(target, template);
  }

  copyObject<T>(target: T): T {
    return JSON.parse(JSON.stringify(target)) as T;
  }

  replaceObjectData(target: ModuleObject<any>, data: ModuleObject<any>): void {
    for (const key in target) {
      delete target[key];
    }

    Object.assign(target, data);
  }

  replaceArrayData(target: any[], data: any[]): void {
    target.splice(0);
    target.push(...data);
  }

  generateRandomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  };

  trimStr(str: string, trim: string): string {
    if (trim === '') return str;
    return str.replace(new RegExp(`^${trim}+|(${trim}+)$`, 'g'), '');
  }

  buildQuery(obj: Record<string, string>, visible?: Record<string, boolean>): string {
    return Object.keys(obj)
      .filter(key => visible?.[key] ?? true)
      .map(key => `${key}=${obj[key]}`)
      .join('&');
  }

  getUUID(): string {
    this.lastUUID = this.generateRandomString();
    return this.lastUUID;
  }
}

export default new Utils();
