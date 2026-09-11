import { useCallback, useEffect, useState } from 'react';
import type { ImageItem } from '../types';
import { useLanguage } from '../i18n/useLanguage';
import { useElementSize } from '../hooks/useElementSize';
import { croppedImageStyle, fitTileSize, type GridSpec } from '../lib/grid';
import { isSolved, shuffleOrder } from '../lib/shuffle';
import { MosaicBoard } from './MosaicBoard';

interface PuzzleGameProps {
  image: ImageItem;
  grid: GridSpec;
  onExit: () => void;
  onNewGame: () => void;
}

type Phase = 'playing' | 'flash' | 'solved';

/** Длительность жёлтой вспышки сетки после победы. */
const FLASH_MS = 500;

export function PuzzleGame({ image, grid, onExit, onNewGame }: PuzzleGameProps) {
  const { lang, t } = useLanguage();
  const [boardAreaRef, boardArea] = useElementSize();

  const [order, setOrder] = useState(() => shuffleOrder(grid.count));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');
  const [showOriginal, setShowOriginal] = useState(false);

  const handleSwap = useCallback(
    (a: number, b: number) => {
      const next = [...order];
      [next[a], next[b]] = [next[b], next[a]];
      setOrder(next);
      setMoves((count) => count + 1);
      if (isSolved(next)) setPhase('flash');
    },
    [order],
  );

  // После вспышки сетка уступает место целой обрезанной картинке.
  useEffect(() => {
    if (phase !== 'flash') return;
    const timer = window.setTimeout(() => setPhase('solved'), FLASH_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const tileSize = fitTileSize(grid, boardArea.width, boardArea.height);
  const solved = phase === 'solved';
  const showWholeImage = showOriginal || solved;

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 py-2 sm:gap-4 sm:py-3">
        <button
          type="button"
          onClick={onExit}
          className="cursor-pointer rounded-full border border-neutral-200 px-5 py-2.5 text-sm text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:px-7 sm:text-base"
        >
          {t.exit}
        </button>

        <p className="px-2 text-sm text-neutral-700 tabular-nums sm:text-base">
          {t.moves}: <span className="font-medium">{moves}</span>
        </p>

        <button
          type="button"
          onClick={() => setShowOriginal((value) => !value)}
          disabled={phase !== 'playing'}
          aria-pressed={showOriginal}
          className="cursor-pointer rounded-full border border-neutral-200 px-5 py-2.5 text-sm text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:pointer-events-none disabled:opacity-0 sm:px-7 sm:text-base"
        >
          {showOriginal ? t.hideOriginal : t.showOriginal}
        </button>
      </div>

      <div ref={boardAreaRef} className="flex min-h-0 flex-1 items-center justify-center">
        {tileSize > 0 &&
          (showWholeImage ? (
            <div
              role="img"
              aria-label={image.title[lang]}
              className={solved ? 'animate-fade-in' : undefined}
              style={{
                ...croppedImageStyle(grid, image.url),
                width: grid.cols * tileSize,
                height: grid.rows * tileSize,
              }}
            />
          ) : (
            <MosaicBoard
              grid={grid}
              url={image.url}
              order={order}
              tileSize={tileSize}
              selected={selected}
              onSelect={setSelected}
              onSwap={handleSwap}
              locked={phase !== 'playing'}
              flashing={phase === 'flash'}
            />
          ))}
      </div>

      {/* Место под сообщение о победе резервируется заранее, чтобы поле не прыгало. */}
      <div className="flex min-h-28 shrink-0 flex-col items-center justify-start gap-2 pt-3 sm:min-h-32">
        {solved && (
          <div className="animate-fade-in flex flex-col items-center gap-2">
            <p className="text-xl font-light text-neutral-900 sm:text-2xl">{t.winMessage}</p>
            <p className="text-sm text-neutral-500">{t.winMoves(moves)}</p>
            <button
              type="button"
              onClick={onNewGame}
              className="mt-1 cursor-pointer rounded-full bg-neutral-900 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {t.newGame}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
