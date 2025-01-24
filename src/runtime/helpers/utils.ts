import { md5 } from 'js-md5';
import type { ModuleObject } from '~/src/runtime/types';

class Utils {
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

  hash(obj: ModuleObject<any>): string {
    return md5.hex(JSON.stringify(obj));
  }

  trimStr(str: string, trim: string): string {
    if (trim === '')
      return str;
    return str.replace(new RegExp(`^${trim}+|(${trim}+)$`, 'g'), '');
  }

  buildQuery(obj: Record<string, string>, visible?: Record<string, boolean>): string {
    return Object.keys(obj)
      .filter(key => visible?.[key] ?? true)
      .map(key => `${key}=${obj[key]}`)
      .join('&');
  }
}

export default new Utils();
