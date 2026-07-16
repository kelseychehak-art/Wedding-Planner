"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A smooth scalloped frame that traces a full rounded rectangle on all four
 * sides. The path is generated from the element's measured size so the scallop
 * bumps stay perfectly circular and evenly spaced at any card width/height.
 */

function scallopPath(w: number, h: number, inset: number, target: number) {
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const ew = x1 - x0;
  const eh = y1 - y0;
  if (ew <= 0 || eh <= 0) return "";

  const nx = Math.max(2, Math.round(ew / target));
  const ny = Math.max(2, Math.round(eh / target));
  const rx = ew / (2 * nx);
  const ry = eh / (2 * ny);

  let d = `M ${x0} ${y0}`;
  // top edge, bumps outward (up)
  for (let i = 0; i < nx; i++) d += ` a ${rx} ${rx} 0 0 1 ${2 * rx} 0`;
  // right edge, bumps outward (right)
  for (let i = 0; i < ny; i++) d += ` a ${ry} ${ry} 0 0 1 0 ${2 * ry}`;
  // bottom edge, bumps outward (down)
  for (let i = 0; i < nx; i++) d += ` a ${rx} ${rx} 0 0 1 ${-2 * rx} 0`;
  // left edge, bumps outward (left)
  for (let i = 0; i < ny; i++) d += ` a ${ry} ${ry} 0 0 1 0 ${-2 * ry}`;
  d += " Z";
  return d;
}

type ScallopFrameProps = {
  color: string; // CSS color / token
  target?: number; // approx scallop width in px
  inset?: number; // distance from the card edge
  strokeWidth?: number;
};

export default function ScallopFrame({
  color,
  target = 26,
  inset = 9,
  strokeWidth = 2,
}: ScallopFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      {size.w > 0 && size.h > 0 && (
        <svg width={size.w} height={size.h} style={{ display: "block", overflow: "visible" }}>
          <path
            d={scallopPath(size.w, size.h, inset + strokeWidth, target)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
