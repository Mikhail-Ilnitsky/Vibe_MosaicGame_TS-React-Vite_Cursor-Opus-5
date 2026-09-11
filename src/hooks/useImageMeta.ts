import { useEffect, useState } from 'react';

export interface ImageMeta {
  status: 'loading' | 'ready' | 'error';
  width: number;
  height: number;
}

const LOADING: ImageMeta = { status: 'loading', width: 0, height: 0 };

/** Размеры уже загруженных картинок переиспользуются между экранами. */
const cache = new Map<string, ImageMeta>();

/** Узнаёт натуральные размеры картинки, предварительно загрузив её в память. */
export function useImageMeta(url: string): ImageMeta {
  const [, forceUpdate] = useState(0);
  const meta = cache.get(url);

  useEffect(() => {
    if (cache.has(url)) return;

    let cancelled = false;
    const finish = (value: ImageMeta) => {
      cache.set(url, value);
      if (!cancelled) forceUpdate((version) => version + 1);
    };

    // Без crossOrigin: нужны только размеры, а загрузка должна переиспользовать
    // тот же кеш браузера, что и background-image фрагментов.
    const image = new Image();
    image.decoding = 'async';
    image.onload = () =>
      finish({ status: 'ready', width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => finish({ status: 'error', width: 0, height: 0 });
    image.src = url;

    return () => {
      cancelled = true;
    };
  }, [url]);

  return meta ?? LOADING;
}
