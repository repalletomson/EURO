'use client';

import { useState } from 'react';
import BrandPreloader from '@/components/preloader/PreloaderClient';
import HomePage from '@/components/site/HomePage';

export default function Home() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <main>
      <BrandPreloader key={replayKey} />
      <HomePage onWatchFilm={() => setReplayKey((k) => k + 1)} />
    </main>
  );
}

