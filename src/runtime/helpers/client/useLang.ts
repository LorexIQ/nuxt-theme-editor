import type {
  ModuleHelpersGetValueByPath,
  ModuleHelpersNestedKeys,
  ModuleHelpersStringKeys,
  ModuleLocalizationStructure
} from '../../types';
import { LANGUAGES } from '../../assets/defaultLanguages';
import utils from '../utils';
import useConfig from './useConfig';
import { useState } from '#imports';

export default function<T extends ModuleHelpersNestedKeys<ModuleLocalizationStructure> | ModuleHelpersStringKeys<ModuleLocalizationStructure>>(path: T): ModuleHelpersGetValueByPath<ModuleLocalizationStructure, T> {
  const moduleConfig = useConfig();
  const localizationConfig = moduleConfig.localization;
  const translations = useState(moduleConfig.keys.state + ':localization', () => localizationConfig.type === 'system' ? LANGUAGES[localizationConfig.lang] : utils.mergeObjects(localizationConfig.translations, LANGUAGES[localizationConfig.parentLang]) as any);

  return path.split('.').reduce((acc, key) => acc?.[key], translations.value) ?? '[NOT FOUND]';
}
