import { sep } from 'node:path';
import { glob, type GlobOptionsWithFileTypesFalse } from 'glob';

export function globSep(path: string) {
  return path.replaceAll(sep, '/');
}

export default function (pattern: string | string[], options?: GlobOptionsWithFileTypesFalse) {
  const _pattern = Array.isArray(pattern) ? pattern.map(p => globSep(p)) : globSep(pattern);
  const matches = options ? glob.globSync(_pattern, options) : glob.globSync(_pattern);
  return matches.map(match => globSep(match));
}
