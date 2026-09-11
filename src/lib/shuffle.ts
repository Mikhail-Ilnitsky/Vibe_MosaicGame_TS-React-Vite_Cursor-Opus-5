/** `order[позиция на поле] = номер фрагмента в правильной сетке`. */
export type BoardOrder = number[];

export function isSolved(order: BoardOrder): boolean {
  return order.every((tileId, position) => tileId === position);
}

/**
 * Перемешивание: ровно N случайных парных обменов для пазла из N плиток.
 * Если после обменов пазл случайно оказался собранным — делаем ещё один обмен.
 */
export function shuffleOrder(count: number, random: () => number = Math.random): BoardOrder {
  const order: BoardOrder = Array.from({ length: count }, (_, index) => index);
  if (count < 2) return order;

  const swap = (a: number, b: number) => {
    [order[a], order[b]] = [order[b], order[a]];
  };

  for (let i = 0; i < count; i += 1) {
    const a = Math.floor(random() * count);
    let b = Math.floor(random() * count);
    if (b === a) b = (a + 1) % count;
    swap(a, b);
  }

  if (isSolved(order)) swap(0, count - 1);

  return order;
}
