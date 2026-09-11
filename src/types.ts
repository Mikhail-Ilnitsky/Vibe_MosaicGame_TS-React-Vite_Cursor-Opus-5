export type Lang = 'ru' | 'en';

export type Orientation = 'landscape' | 'portrait' | 'square';

export interface ImageItem {
  id: string;
  url: string;
  orientation: Orientation;
  title: Record<Lang, string>;
}
