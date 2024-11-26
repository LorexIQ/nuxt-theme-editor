import path from 'node:path';
import { glob, type GlobOptionsWithFileTypesFalse } from 'glob';

function _glob(pattern: string | string[], options?: GlobOptionsWithFileTypesFalse) {
  const _pattern = Array.isArray(pattern) ? pattern.map(p => _sep(p)) : _sep(pattern);
  const matches = options ? glob.globSync(_pattern, options) : glob.globSync(_pattern);
  return matches.map(match => _sep(match));
}

function _sep(p: string) {
  return p.replaceAll('\\', '/');
}

function _join(...ps: string[]) {
  return _sep(path.join(...ps));
}

function _resolve(...ps: string[]) {
  return _sep(path.resolve(...ps));
}

function _relative(from: string, to: string) {
  return _sep(path.relative(from, to));
}

export default {
  glob: _glob,
  sep: _sep,
  join: _join,
  resolve: _resolve,
  relative: _relative,
  parse: path.parse
};
