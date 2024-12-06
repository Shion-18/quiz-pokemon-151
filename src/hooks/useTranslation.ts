import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, params: Record<string, string | number> = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value[k];
    }

    if (typeof value === 'string') {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(`{${key}}`, val.toString()),
        value
      );
    }

    return value;
  };

  return { t };
};