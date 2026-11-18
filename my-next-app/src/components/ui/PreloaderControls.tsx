'use client';

import type { Phase } from '@/components/preloader/BrandPreloader';

interface PreloaderControlsProps {
  phase: Phase;
  onSkip: () => void;
  onReplay: () => void;
}

/** Skip while the film is playing, Replay once the wordmark has locked up. */
export default function PreloaderControls({ phase, onSkip, onReplay }: PreloaderControlsProps) {
  if (phase !== 'playing' && phase !== 'done') return null;

  return (
    <div className="preloader__controls">
      {phase === 'playing' ? (
        <button type="button" className="preloader__control" onClick={onSkip} aria-label="Skip animation">
          Skip
        </button>
      ) : (
        <button type="button" className="preloader__control" onClick={onReplay} aria-label="Replay animation">
          Replay
        </button>
      )}
    </div>
  );
}
