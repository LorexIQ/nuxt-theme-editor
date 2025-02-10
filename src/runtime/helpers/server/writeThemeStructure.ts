import type { CodeBlockWriter } from 'ts-morph';
import type { ModuleDefineThemeBlockRootReturn, ModuleDefineThemeBlockStyles } from '../../types';
import defineChecker from '../defineChecker';

type FileType = 'type' | 'object';

const generateBlockCode = (writer: CodeBlockWriter, obj: Record<string, any>, type: FileType) => {
  writer.inlineBlock(() => {
    Object.entries(obj).forEach(([key, value], index) => {
      if (typeof value === 'object') {
        writer.write(`'${key}': `);
        generateBlockCode(writer, obj[key], type);
      } else {
        writer.write(`'${key}': ${type === 'type' ? 'string' : `'${value}'`}`);
      }

      if (type === 'type' || Object.keys(obj).length > index + 1) writer.write(`${type === 'type' ? ';' : ','}\n`);
    });
  });
};
const grabAllThemeStylesToStructure = (styles: ModuleDefineThemeBlockStyles[]) => {
  const result: Record<string, any> = {};
  styles.forEach((block) => {
    if (defineChecker(block)) {
      result[block.id] = grabAllThemeStylesToStructure(block.styles as ModuleDefineThemeBlockStyles[]);
    } else {
      Object.assign(result, Object.entries(block).reduce((acc, [key]) => ({ ...acc, [key]: '' }), {}));
    }
  });
  return result;
};

export default function (writer: CodeBlockWriter, theme: ModuleDefineThemeBlockRootReturn, type: FileType) {
  const preparedObj = grabAllThemeStylesToStructure(theme.styles);
  return generateBlockCode(writer, preparedObj, type);
}
