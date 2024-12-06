export default function mergeObjects<T>(target: Record<any, any>, template: T): T {
  if (Array.isArray(template)) {
    if (!Array.isArray(target)) target = [];

    return template.map((templateItem, index) => {
      if (typeof templateItem === 'object' && templateItem !== null) return mergeObjects(target[index] || {}, templateItem);
      else return target[index] !== undefined ? target[index] : templateItem;
    }) as T;
  }

  if (typeof template === 'object' && template !== null) {
    if (typeof target !== 'object' || target === null) target = {};

    const result: Record<string, any> = {};

    for (const key in template) result[key] = mergeObjects(target[key], template[key]);

    return result as T;
  }

  return target !== undefined ? target : template as T;
}
