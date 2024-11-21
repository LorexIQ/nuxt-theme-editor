import clientGetter from '../helpers/clientGetter';
import type { ModuleNestedKeys } from '../types';
import type { ModuleMetaBlocks } from '../meta/themesStructure';

export default function useBlock(block: ModuleNestedKeys<ModuleMetaBlocks>) {
  console.log(block);
  const client = clientGetter().value;
}
