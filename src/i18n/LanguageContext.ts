import { createContext } from 'react';
import type { Lang } from '../types';
import type { Dictionary } from './translations';

export interface LanguageContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
