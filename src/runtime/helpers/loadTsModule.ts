import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import { resolveAlias } from '@nuxt/kit';
import type { SourceFile } from 'ts-morph';
import tsMorphProject from './tsMorphProject';

function clearTemp(tempPath: string, file?: SourceFile) {
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  file && tsMorphProject.removeSourceFile(file);
}
function isFileExists(filePath: string) {
  const checkedTypes = ['.ts', '.js'];

  for (const checkedType of checkedTypes) {
    if (fs.existsSync(filePath + checkedType)) {
      return filePath + checkedType;
    }
  }

  return undefined;
}
function getImportPath(ctxPath: string, p: string) {
  const asAliasResolve = resolveAlias(p);
  const asPathResolve = path.resolve(ctxPath, p);
  const isAliasPath = asAliasResolve !== p;
  const isRelativePath = p.startsWith('.') || p.startsWith('/');
  const importPath = isRelativePath ? asPathResolve : asAliasResolve;

  if (isAliasPath || isRelativePath) {
    let fileExists = isFileExists(importPath);

    if (!fileExists) fileExists = isFileExists(path.join(importPath, 'index'));
    if (fileExists) return fileExists;
  }

  return undefined;
}
function getTempName(p: string, t: 'ts' | 'js') {
  return p.replace(/\.ts$/, `.temp.${t}`);
}

export async function loadTsModuleBase(modulePath: string) {
  const tempCleaners: (() => void)[] = [];
  const fullPath = path.resolve(modulePath);
  const parsedPath = path.parse(fullPath);
  const tempTsFilePath = getTempName(fullPath, 'ts');
  const tempJsFilePath = getTempName(fullPath, 'js');
  let sourceFile: SourceFile | undefined = undefined;

  try {
    const tsCode = fs.readFileSync(fullPath, 'utf8');
    sourceFile = tsMorphProject.createSourceFile(tempTsFilePath, tsCode, { overwrite: true });

    for (const imp of sourceFile.getImportDeclarations()) {
      const importPath = getImportPath(parsedPath.dir, imp.getStructure().moduleSpecifier);
      if (importPath) {
        const dir = path.parse(modulePath).dir;
        const relativePath = './' + path.relative(path.parse(modulePath).dir, importPath);
        const importFilePath = path.join(dir, relativePath);
        const loadedImport = await loadTsModuleBase(importFilePath);
        imp.setModuleSpecifier(getTempName(relativePath, 'js'));
        tempCleaners.push(loadedImport.clearTemp);

        if (!fs.existsSync(importFilePath)) imp.remove();
      }
    }

    const { code } = await esbuild.transform(sourceFile.getFullText(), { loader: 'ts' });
    fs.writeFileSync(tempJsFilePath, code, 'utf8');
    const module = await import(pathToFileURL(tempJsFilePath).href);
    tempCleaners.forEach(tempCleaner => tempCleaner());

    return {
      clearTemp: clearTemp.bind(null, tempJsFilePath, sourceFile),
      module
    };
  } catch (e) {
    console.error(e);
    return {
      clearTemp: clearTemp.bind(null, tempJsFilePath, sourceFile),
      module: undefined
    };
  }
}

export async function loadTsModule(modulePath: string) {
  const loader = await loadTsModuleBase(modulePath);
  loader.clearTemp();
  return loader.module;
}
