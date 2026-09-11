import type { CSSProperties } from 'react';

/** Минимальное и максимальное деление по меньшей стороне картинки. */
export const MIN_DIVISIONS = 5;
export const MAX_DIVISIONS = 11;

export const DIVISION_OPTIONS = Array.from(
  { length: MAX_DIVISIONS - MIN_DIVISIONS + 1 },
  (_, index) => MIN_DIVISIONS + index,
);

export interface GridSpec {
  /** На сколько частей поделена меньшая сторона (5…11). */
  divisions: number;
  cols: number;
  rows: number;
  /** Сторона квадратного фрагмента в пикселях оригинала. */
  tileSize: number;
  /** Размер используемой (обрезанной) области оригинала. */
  cropWidth: number;
  cropHeight: number;
  /** Отступ обрезанной области от края оригинала: картинка центрируется. */
  offsetX: number;
  offsetY: number;
  /** Натуральный размер файла картинки. */
  imageWidth: number;
  imageHeight: number;
  count: number;
}

/**
 * Меньшая сторона всегда делится ровно на `divisions` квадратов,
 * по большей стороне количество квадратов округляется вниз,
 * а остаток оригинала обрезается симметрично с двух сторон.
 *
 * Пример: 1000×700 при divisions = 6 → фрагмент 116×116, сетка 8×6,
 * используется область 928×696 из центра картинки.
 */
export function computeGrid(imageWidth: number, imageHeight: number, divisions: number): GridSpec {
  const minSide = Math.min(imageWidth, imageHeight);
  const tileSize = Math.max(1, Math.floor(minSide / divisions));

  const cols = imageWidth <= imageHeight ? divisions : Math.floor(imageWidth / tileSize);
  const rows = imageHeight <= imageWidth ? divisions : Math.floor(imageHeight / tileSize);

  const cropWidth = cols * tileSize;
  const cropHeight = rows * tileSize;

  return {
    divisions,
    cols,
    rows,
    tileSize,
    cropWidth,
    cropHeight,
    offsetX: (imageWidth - cropWidth) / 2,
    offsetY: (imageHeight - cropHeight) / 2,
    imageWidth,
    imageHeight,
    count: cols * rows,
  };
}

/** Координаты фрагмента в правильной (собранной) сетке. */
export function tileCoords(grid: GridSpec, tileId: number): { x: number; y: number } {
  return { x: tileId % grid.cols, y: Math.floor(tileId / grid.cols) };
}

/**
 * Фон одного фрагмента: картинка не режется физически, а сдвигается процентами.
 *
 * Размер фона считается в «плитках»: по ширине картинка занимает
 * imageWidth / tileSize плиток, по высоте — imageHeight / tileSize.
 * Позиция — доля от переполнения фона относительно элемента, с учётом
 * центрирующей обрезки. Когда картинка делится без остатка (offset = 0),
 * формула вырождается в background-size: cols*100% rows*100%
 * и background-position: x/(cols-1)*100%.
 */
export function tileBackgroundStyle(grid: GridSpec, url: string, tileId: number): CSSProperties {
  const { x, y } = tileCoords(grid, tileId);
  const spanX = grid.imageWidth / grid.tileSize;
  const spanY = grid.imageHeight / grid.tileSize;

  const positionX = spanX > 1 ? ((grid.offsetX / grid.tileSize + x) / (spanX - 1)) * 100 : 0;
  const positionY = spanY > 1 ? ((grid.offsetY / grid.tileSize + y) / (spanY - 1)) * 100 : 0;

  return {
    backgroundImage: `url(${JSON.stringify(url)})`,
    backgroundSize: `${spanX * 100}% ${spanY * 100}%`,
    backgroundPosition: `${positionX}% ${positionY}%`,
    backgroundRepeat: 'no-repeat',
  };
}

/**
 * Фон для целой картинки, обрезанной точно так же, как пазл.
 * Обрезка симметричная, поэтому позиция — ровно центр.
 */
export function croppedImageStyle(grid: GridSpec, url: string): CSSProperties {
  return {
    backgroundImage: `url(${JSON.stringify(url)})`,
    backgroundSize: `${(grid.imageWidth / grid.cropWidth) * 100}% ${
      (grid.imageHeight / grid.cropHeight) * 100
    }%`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
  };
}

/**
 * Размер отображаемого фрагмента: пазл целиком помещается в доступную область,
 * но никогда не растягивается крупнее масштаба 1:1 к оригиналу.
 */
export function fitTileSize(grid: GridSpec, availableWidth: number, availableHeight: number) {
  if (availableWidth <= 0 || availableHeight <= 0) return 0;
  return Math.min(availableWidth / grid.cols, availableHeight / grid.rows, grid.tileSize);
}
