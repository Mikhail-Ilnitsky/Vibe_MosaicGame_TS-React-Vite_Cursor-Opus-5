import type { Lang } from '../types';

export interface Dictionary {
  appTitle: string;
  galleryHeading: string;
  gallerySubheading: string;
  difficultyHeading: string;
  difficultySubheading: string;
  gridLabel: (cols: number, rows: number) => string;
  piecesLabel: (count: number) => string;
  exit: string;
  moves: string;
  showOriginal: string;
  hideOriginal: string;
  winMessage: string;
  winMoves: (moves: number) => string;
  newGame: string;
  loading: string;
  loadError: string;
  languageLabel: string;
}

function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const ru: Dictionary = {
  appTitle: 'Игра-мозаика',
  galleryHeading: 'Выберите картинку',
  gallerySubheading: 'Соберите изображение из перемешанных квадратов',
  difficultyHeading: 'Выберите сложность',
  difficultySubheading: 'Количество частей по меньшей стороне картинки',
  gridLabel: (cols, rows) => `${cols} × ${rows}`,
  piecesLabel: (count) => `${count} ${plural(count, 'фрагмент', 'фрагмента', 'фрагментов')}`,
  exit: 'Выйти',
  moves: 'Ходы',
  showOriginal: 'Показать оригинал',
  hideOriginal: 'Вернуться к пазлу',
  winMessage: 'У вас получилось!',
  winMoves: (moves) => `Собрано за ${moves} ${plural(moves, 'ход', 'хода', 'ходов')}`,
  newGame: 'Начать новую игру',
  loading: 'Загрузка…',
  loadError: 'Не удалось загрузить картинку',
  languageLabel: 'Язык',
};

const en: Dictionary = {
  appTitle: 'Mosaic Game',
  galleryHeading: 'Choose a picture',
  gallerySubheading: 'Restore the image from shuffled squares',
  difficultyHeading: 'Choose difficulty',
  difficultySubheading: 'Number of pieces along the shorter side of the picture',
  gridLabel: (cols, rows) => `${cols} × ${rows}`,
  piecesLabel: (count) => `${count} ${count === 1 ? 'piece' : 'pieces'}`,
  exit: 'Exit',
  moves: 'Moves',
  showOriginal: 'Show original',
  hideOriginal: 'Back to puzzle',
  winMessage: 'You did it!',
  winMoves: (moves) => `Solved in ${moves} ${moves === 1 ? 'move' : 'moves'}`,
  newGame: 'Start a new game',
  loading: 'Loading…',
  loadError: 'Failed to load the picture',
  languageLabel: 'Language',
};

export const DICTIONARIES: Record<Lang, Dictionary> = { ru, en };

export function detectLanguage(): Lang {
  const navigatorLanguage =
    typeof navigator === 'undefined' ? '' : (navigator.language ?? '').toLowerCase();
  return navigatorLanguage.includes('ru') ? 'ru' : 'en';
}
