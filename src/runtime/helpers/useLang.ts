import type {
  ModuleHelpersGetValueByPath, ModuleHelpersNestedKeys,
  ModuleHelpersStringKeys,
  ModuleLocalizationStructure,
  ModuleOptionsExtend
} from '../types';
import { LANGUAGES } from '../assets/defaultLanguages';
import utils from './utils';
import { useRuntimeConfig, useState } from '#imports';

export default function<T extends ModuleHelpersNestedKeys<ModuleLocalizationStructure> | ModuleHelpersStringKeys<ModuleLocalizationStructure>>(path: T): ModuleHelpersGetValueByPath<ModuleLocalizationStructure, T> {
  const moduleConfig = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
  const localizationConfig = moduleConfig.localization;
  const translations = useState(moduleConfig.keys.state + ':localization', () => localizationConfig.type === 'system' ? LANGUAGES[localizationConfig.lang] : utils.mergeObjects(localizationConfig.translations, LANGUAGES[localizationConfig.parentLang]) as any);

  return path.split('.').reduce((acc, key) => acc?.[key], translations.value) ?? '[NOT FOUND]';
}
