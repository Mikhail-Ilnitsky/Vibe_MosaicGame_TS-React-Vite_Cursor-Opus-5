import type { ImageItem } from '../types';
import { IMAGES } from '../data/images';
import { useLanguage } from '../i18n/useLanguage';

interface GalleryProps {
  onSelect: (image: ImageItem) => void;
}

export function Gallery({ onSelect }: GalleryProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto px-4 pb-10">
      <header className="py-5 text-center sm:py-8">
        <h1 className="text-2xl font-light tracking-tight text-neutral-900 sm:text-4xl">
          {t.galleryHeading}
        </h1>
        <p className="mt-2 text-sm text-neutral-500 sm:text-base">{t.gallerySubheading}</p>
      </header>

      <ul className="flex w-full max-w-5xl flex-wrap items-start justify-center gap-4 sm:gap-8">
        {IMAGES.map((image) => (
          <li key={image.id} className="flex max-w-full flex-col items-center">
            <button
              type="button"
              onClick={() => onSelect(image)}
              className="group flex max-w-full cursor-pointer flex-col items-center rounded-xl p-2 transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              title={image.title[lang]}
            >
              <img
                src={image.url}
                alt={image.title[lang]}
                loading="lazy"
                // Высота одинакова у всех миниатюр, ширина — по пропорциям картинки;
                // на невысоких экранах высота дополнительно ограничена долей вьюпорта.
                className="h-28 max-h-[24vh] w-auto max-w-full object-contain sm:h-36 lg:h-44 xl:h-48"
              />
              <span className="mt-3 block text-sm text-neutral-700 sm:hidden">
                {image.title[lang]}
              </span>
              <span className="mt-3 hidden text-sm text-neutral-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                {image.title[lang]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
