import { translations, TranslationDict } from './locales';
import { SupportedLanguage } from '../types/settings';

export function getTranslation(lang: SupportedLanguage = 'zh-CN'): TranslationDict {
  return translations[lang] || translations['zh-CN'];
}

export function formatString(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
  }
  return result;
}
