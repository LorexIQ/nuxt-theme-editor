export default function<T>(target: Record<any, any>, template: T): T {
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
        if (key === 'id' && level) result[key] = _template[key];
        else result[key] = merger(_target[key], _template[key], level + 1);
      }

      return result as TR;
    }

    return _target !== undefined ? _target : _template as TR;
  };

  return merger(target, template);
}
