import { useMemo } from 'react';
import type { ImageItem } from '../types';
import { useLanguage } from '../i18n/useLanguage';
import { useImageMeta } from '../hooks/useImageMeta';
import { computeGrid } from '../lib/grid';
import { PuzzleGame } from './PuzzleGame';

interface GameScreenProps {
  image: ImageItem;
  divisions: number;
  onExit: () => void;
  onNewGame: () => void;
}

export function GameScreen({ image, divisions, onExit, onNewGame }: GameScreenProps) {
  const { t } = useLanguage();
  const meta = useImageMeta(image.url);

  const grid = useMemo(
    () => (meta.status === 'ready' ? computeGrid(meta.width, meta.height, divisions) : null),
    [divisions, meta.height, meta.status, meta.width],
  );

  return (
    <div className="flex h-full min-h-0 flex-col px-3 pb-3 sm:px-6 sm:pb-4">
      {grid ? (
        <PuzzleGame image={image} grid={grid} onExit={onExit} onNewGame={onNewGame} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className={meta.status === 'error' ? 'text-red-500' : 'text-neutral-400'}>
            {meta.status === 'error' ? t.loadError : t.loading}
          </p>
        </div>
      )}
    </div>
  );
}
