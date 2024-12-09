import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import { resolveAlias } from '@nuxt/kit';
import type { SourceFile } from 'ts-morph';
import type { ModuleLoadTsModuleBaseReturn } from '../../types';
import uPath from './uPath';
import tsMorphProject from './tsMorphProject';

function clearTemp(tempPath: string, file?: SourceFile): void {
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  file && tsMorphProject.removeSourceFile(file);
}
function isFileExists(filePath: string): string | undefined {
  const checkedTypes = ['.ts', '.js'];

  for (const checkedType of checkedTypes) {
    if (fs.existsSync(filePath + checkedType)) {
      return filePath + checkedType;
    }
  }

  return undefined;
}
function getImportPath(ctxPath: string, p: string): string | undefined {
  const asAliasResolve = resolveAlias(p);
  const asPathResolve = uPath.resolve(ctxPath, p);
  const isAliasPath = asAliasResolve !== p;
  const isRelativePath = p.startsWith('.') || p.startsWith('/');
  const importPath = isRelativePath ? asPathResolve : asAliasResolve;

  if (isAliasPath || isRelativePath) {
    let fileExists = isFileExists(importPath);

    if (!fileExists) fileExists = isFileExists(uPath.join(importPath, 'index'));
    if (fileExists) return fileExists;
  }

  return undefined;
}
function getTempName(path: string, timestamp: number, scope: 'ts' | 'js'): string {
  return path.replace(/\.ts$/, `.${timestamp}.temp.${scope}`);
}

async function loadTsModuleBase(modulePath: string): Promise<ModuleLoadTsModuleBaseReturn> {
  const tempCleaners: (() => void)[] = [];
  const fullPath = uPath.resolve(modulePath);
  const parsedPath = uPath.parse(fullPath);
  const fileReadTimestamp = Date.now();
  const tempTsFilePath = getTempName(fullPath, fileReadTimestamp, 'ts');
  const tempJsFilePath = getTempName(fullPath, fileReadTimestamp, 'js');
  let sourceFile: SourceFile | undefined = undefined;

  const clearAllTemps = () => {
    clearTemp(tempJsFilePath, sourceFile);
    tempCleaners.forEach(tempCleaner => tempCleaner());
  };

  try {
    const tsCode = fs.readFileSync(fullPath, 'utf8');
    sourceFile = tsMorphProject.createSourceFile(tempTsFilePath, tsCode, { overwrite: true });

    for (const imp of sourceFile.getImportDeclarations()) {
      const importPath = getImportPath(parsedPath.dir, imp.getStructure().moduleSpecifier);

      if (importPath) {
        const dir = uPath.parse(modulePath).dir;
        const relativePath = './' + uPath.relative(uPath.parse(modulePath).dir, importPath);
        const importFilePath = uPath.join(dir, relativePath);
        const loadedImport = await loadTsModuleBase(importFilePath);
        imp.setModuleSpecifier(getTempName(relativePath, loadedImport.timestamp, 'js'));
        tempCleaners.push(loadedImport.clearTemp);

        if (!fs.existsSync(importFilePath)) imp.remove();
      }
    }

    const { code } = await esbuild.transform(sourceFile.getFullText(), { loader: 'ts' });
    fs.writeFileSync(tempJsFilePath, code, 'utf8');
    const module = await import(pathToFileURL(tempJsFilePath).href);

    return {
      clearTemp: clearAllTemps,
      timestamp: fileReadTimestamp,
      module
    };
  } catch (e) {
    console.error(e);
    return {
      clearTemp: clearAllTemps,
      timestamp: fileReadTimestamp,
      module: undefined
    };
  }
}

export async function loadTsModule(modulePath: string): Promise<any> {
  const loader = await loadTsModuleBase(modulePath);
  loader.clearTemp();
  return loader.module;
}
