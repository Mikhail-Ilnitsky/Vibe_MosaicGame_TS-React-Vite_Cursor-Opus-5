import { useCallback, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Следит за размером элемента через ResizeObserver.
 * Возвращает ref-колбэк, чтобы подписка переживала перемонтирование узла.
 */
export function useElementSize(): [(node: HTMLElement | null) => (() => void) | undefined, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize((previous) =>
        previous.width === rect.width && previous.height === rect.height
          ? previous
          : { width: rect.width, height: rect.height },
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
