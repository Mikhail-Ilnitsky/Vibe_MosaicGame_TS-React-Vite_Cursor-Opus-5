import type { Lang } from '../types';
import { useLanguage } from '../i18n/useLanguage';

const OPTIONS: Lang[] = ['ru', 'en'];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border border-neutral-200 p-0.5"
      role="group"
      aria-label={t.languageLabel}
    >
      {OPTIONS.map((option) => {
        const isActive = option === lang;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={isActive}
            className={`min-w-11 rounded-full px-3 py-1.5 text-sm font-medium tracking-wide transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
