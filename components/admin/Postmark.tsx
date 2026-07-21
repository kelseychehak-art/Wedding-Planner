/*
 * Decorative "Italy" postmark used at the bottom of the admin sidebar
 * (matches the terracotta circular stamp in the approved admin mockups).
 * Pure inline SVG — circular text on a dashed ring with a heart center.
 */

export default function Postmark({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
    >
      <defs>
        <path
          id="postmark-circle"
          d="M48 14a34 34 0 1 1 0 68 34 34 0 1 1 0-68"
        />
      </defs>
      <circle
        cx="48"
        cy="48"
        r="45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.5 4"
      />
      <circle cx="48" cy="48" r="26" stroke="currentColor" strokeWidth="1" />
      <text
        fill="currentColor"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.42em"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <textPath href="#postmark-circle" startOffset="1%">
          ITALY
        </textPath>
        <textPath href="#postmark-circle" startOffset="51%">
          ITALY
        </textPath>
      </text>
      <path
        d="M48 56s-7-4.4-7-9.2A3.7 3.7 0 0 1 48 44.6a3.7 3.7 0 0 1 7 2.2c0 4.8-7 9.2-7 9.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 41.5h3.5M69.5 41.5H73M23 54.5h3.5M69.5 54.5H73"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
