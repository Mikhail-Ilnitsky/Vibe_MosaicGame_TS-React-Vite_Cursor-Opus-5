import { useState } from 'react';
import type { ImageItem } from './types';
import { useLanguage } from './i18n/useLanguage';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Gallery } from './components/Gallery';
import { DifficultyScreen } from './components/DifficultyScreen';
import { GameScreen } from './components/GameScreen';

type Screen =
  | { name: 'gallery' }
  | { name: 'difficulty'; image: ImageItem }
  | { name: 'game'; image: ImageItem; divisions: number };

export function App() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState<Screen>({ name: 'gallery' });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-neutral-900">
      <header className="flex shrink-0 items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
        <span className="text-sm font-medium tracking-wide text-neutral-400 uppercase">
          {t.appTitle}
        </span>
        <LanguageSwitcher />
      </header>

      <main className="min-h-0 flex-1">
        {screen.name === 'gallery' && (
          <Gallery onSelect={(image) => setScreen({ name: 'difficulty', image })} />
        )}

        {screen.name === 'difficulty' && (
          <DifficultyScreen
            image={screen.image}
            onStart={(divisions) => setScreen({ name: 'game', image: screen.image, divisions })}
            onExit={() => setScreen({ name: 'gallery' })}
          />
        )}

        {screen.name === 'game' && (
          <GameScreen
            key={`${screen.image.id}-${screen.divisions}`}
            image={screen.image}
            divisions={screen.divisions}
            onExit={() => setScreen({ name: 'gallery' })}
            onNewGame={() => setScreen({ name: 'gallery' })}
          />
        )}
      </main>
    </div>
  );
}
