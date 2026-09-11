import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../types';
import { LanguageContext } from './LanguageContext';
import { DICTIONARIES, detectLanguage } from './translations';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLanguage);

  // Заголовок вкладки остаётся «Игра-мозаика» по требованию ТЗ,
  // меняется только атрибут языка документа.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, t: DICTIONARIES[lang], setLang }), [lang]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}
