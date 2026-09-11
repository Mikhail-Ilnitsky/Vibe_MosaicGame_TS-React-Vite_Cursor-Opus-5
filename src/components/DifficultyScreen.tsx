import type { ImageItem } from '../types';
import { useLanguage } from '../i18n/useLanguage';
import { useImageMeta } from '../hooks/useImageMeta';
import { DIVISION_OPTIONS, computeGrid } from '../lib/grid';

interface DifficultyScreenProps {
  image: ImageItem;
  onStart: (divisions: number) => void;
  onExit: () => void;
}

export function DifficultyScreen({ image, onStart, onExit }: DifficultyScreenProps) {
  const { lang, t } = useLanguage();
  const meta = useImageMeta(image.url);

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto px-4 pb-10">
      <header className="flex w-full max-w-3xl flex-col items-center py-6 text-center sm:py-8">
        <h2 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
          {t.difficultyHeading}
        </h2>
        <p className="mt-2 text-sm text-neutral-500">{t.difficultySubheading}</p>
      </header>

      <img
        src={image.url}
        alt={image.title[lang]}
        className="h-28 w-auto max-w-full object-contain sm:h-36"
      />
      <p className="mt-3 text-sm text-neutral-700">{image.title[lang]}</p>

      {meta.status === 'loading' && <p className="mt-10 text-neutral-400">{t.loading}</p>}
      {meta.status === 'error' && <p className="mt-10 text-red-500">{t.loadError}</p>}

      {meta.status === 'ready' && (
        <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DIVISION_OPTIONS.map((divisions) => {
            const grid = computeGrid(meta.width, meta.height, divisions);
            return (
              <button
                key={divisions}
                type="button"
                onClick={() => onStart(divisions)}
                className="cursor-pointer rounded-2xl border border-neutral-200 px-4 py-5 text-center transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <span className="block text-2xl font-light">
                  {t.gridLabel(grid.cols, grid.rows)}
                </span>
                <span className="mt-1 block text-xs opacity-70">{t.piecesLabel(grid.count)}</span>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onExit}
        className="mt-10 cursor-pointer rounded-full border border-neutral-200 px-8 py-3 text-base text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        {t.exit}
      </button>
    </div>
  );
}
