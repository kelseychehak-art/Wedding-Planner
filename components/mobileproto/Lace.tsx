/*
 * Hand-drawn lace motifs as inline SVG — recolor via `color` (currentColor),
 * crisp at any size, no assets to license. First pass; easy to refine.
 */

/* A delicate centered divider: fine rules, scallops, eyelet dots, a little floret. */
export function LaceDivider({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 24"
      width="300"
      height="24"
      fill="none"
      aria-hidden="true"
    >
      {/* rules */}
      <line x1="34" y1="12" x2="126" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      <line x1="174" y1="12" x2="266" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      {/* scallops */}
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.9">
        <path d="M46 12 q9 -7 18 0" />
        <path d="M72 12 q9 -7 18 0" />
        <path d="M98 12 q9 -7 18 0" />
        <path d="M184 12 q9 -7 18 0" />
        <path d="M210 12 q9 -7 18 0" />
        <path d="M236 12 q9 -7 18 0" />
      </g>
      {/* eyelet dots */}
      <g fill="currentColor">
        <circle cx="55" cy="14.5" r="1.1" />
        <circle cx="81" cy="14.5" r="1.1" />
        <circle cx="107" cy="14.5" r="1.1" />
        <circle cx="193" cy="14.5" r="1.1" />
        <circle cx="219" cy="14.5" r="1.1" />
        <circle cx="245" cy="14.5" r="1.1" />
        <circle cx="34" cy="12" r="1.8" />
        <circle cx="266" cy="12" r="1.8" />
      </g>
      {/* center floret */}
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <path d="M150 3 C154 8 154 16 150 21 C146 16 146 8 150 3 Z" />
        <path d="M137 12 C142 8 158 8 163 12 C158 16 142 16 137 12 Z" />
      </g>
      <circle cx="150" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}

/* An L-shaped corner flourish for framing panels/cards. */
export function LaceCorner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 70 70"
      width="70"
      height="70"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.9">
        {/* top edge scallops */}
        <path d="M10 8 q7 -6 14 0" />
        <path d="M24 8 q7 -6 14 0" />
        <path d="M38 8 q7 -6 14 0" />
        {/* left edge scallops */}
        <path d="M8 10 q-6 7 0 14" />
        <path d="M8 24 q-6 7 0 14" />
        <path d="M8 38 q-6 7 0 14" />
        {/* inner curl */}
        <path d="M10 10 C22 14 26 18 30 30" />
      </g>
      <g fill="currentColor">
        <circle cx="17" cy="10" r="1" />
        <circle cx="31" cy="10" r="1" />
        <circle cx="45" cy="10" r="1" />
        <circle cx="10" cy="17" r="1" />
        <circle cx="10" cy="31" r="1" />
        <circle cx="10" cy="45" r="1" />
        <circle cx="8" cy="8" r="1.8" />
        <circle cx="30" cy="30" r="1.4" />
      </g>
    </svg>
  );
}
