'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { BRAND } from '@/config/brandConfig';

export interface EuroWordmarkHandle {
  root: HTMLDivElement | null;
  /** E, U, R — the O is the live globe. */
  letters: HTMLSpanElement[];
  oSlot: HTMLDivElement | null;
  finishes: HTMLDivElement | null;
  divider: HTMLDivElement | null;
  tagline: HTMLDivElement | null;
  measureOSlot: () => DOMRect | null;
}

/**
 * EURO FINISHES wordmark.
 *
 *   E  U  R  (O)      ← (O) is a transparent circular slot; the live globe
 *      FINISHES          canvas is clipped and slid into it at the end
 *   ────────────────
 *   ITALIAN TEXTURE WALL PAINT
 *
 * All elements start hidden; the master timeline reveals them.
 */
const EuroWordmark = forwardRef<EuroWordmarkHandle>((_, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const letterERef = useRef<HTMLSpanElement>(null);
  const letterURef = useRef<HTMLSpanElement>(null);
  const letterRRef = useRef<HTMLSpanElement>(null);
  const oSlotRef = useRef<HTMLDivElement>(null);
  const finishesRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    get letters() {
      return [letterERef.current, letterURef.current, letterRRef.current].filter(
        (el): el is HTMLSpanElement => Boolean(el),
      );
    },
    get oSlot() {
      return oSlotRef.current;
    },
    get finishes() {
      return finishesRef.current;
    },
    get divider() {
      return dividerRef.current;
    },
    get tagline() {
      return taglineRef.current;
    },
    measureOSlot: () => oSlotRef.current?.getBoundingClientRect() ?? null,
  }));

  return (
    <div
      ref={rootRef}
      className="wordmark"
      aria-label={`${BRAND.name} — ${BRAND.tagline}`}
      style={{ color: BRAND.chalk }}
    >
      <div className="wordmark__row">
        <span ref={letterERef} className="wordmark__letter">
          E
        </span>
        <span ref={letterURef} className="wordmark__letter">
          U
        </span>
        <span ref={letterRRef} className="wordmark__letter">
          R
        </span>
        <div ref={oSlotRef} className="wordmark__o" aria-hidden="true" />
      </div>

      <div ref={finishesRef} className="wordmark__finishes" style={{ color: BRAND.darkSecondaryText }}>
        {BRAND.subBrand}
      </div>

      <div ref={dividerRef} className="wordmark__divider" />

      <div ref={taglineRef} className="wordmark__tagline" style={{ color: BRAND.softSage }}>
        {BRAND.tagline}
      </div>
    </div>
  );
});

EuroWordmark.displayName = 'EuroWordmark';
export default EuroWordmark;
