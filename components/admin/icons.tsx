/*
 * Thin-line icon set for the admin back-office.
 * Hand-rolled inline SVGs (stroke: currentColor, 1.5px) so we stay
 * dependency-free and match the approved admin mockups' line-icon style.
 * These are admin-only — the guest site keeps its hand-inked illustrations.
 */

type IconProps = {
  size?: number;
  className?: string;
};

function base(size: number | undefined, className: string | undefined) {
  return {
    width: size ?? 16,
    height: size ?? 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

export function IconHome({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function IconUsers({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M15.5 5.4a3.25 3.25 0 1 1 .9 6.35" />
      <path d="M17.5 14.7c1.7.5 2.7 1.9 3 4" />
    </svg>
  );
}

export function IconBuilding({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 20h16" />
      <path d="M6 20V6.5L12 4l6 2.5V20" />
      <path d="M9.5 9.5h1.2M13.3 9.5h1.2M9.5 12.8h1.2M13.3 12.8h1.2" />
      <path d="M10.5 20v-3.5h3V20" />
    </svg>
  );
}

export function IconStore({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4.5 9.5 5.6 5h12.8l1.1 4.5" />
      <path d="M4.5 9.5a2.4 2.4 0 0 0 4.8 0 2.4 2.4 0 0 0 4.8 0 2.4 2.4 0 0 0 4.8 0" />
      <path d="M5.5 12v8h13v-8" />
      <path d="M9.5 20v-4.5h5V20" />
    </svg>
  );
}

export function IconWallet({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3.5" y="6.5" width="17" height="13" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M15.5 14.5h2" />
    </svg>
  );
}

export function IconCalendar({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
      <path d="M4 10h16" />
      <path d="M8.5 3.5v3.5M15.5 3.5v3.5" />
    </svg>
  );
}

export function IconScale({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 4.5v15M8 19.5h8" />
      <path d="M5.5 7 12 5.5 18.5 7" />
      <path d="M5.5 7l-2 5a2.7 2.7 0 0 0 4 0l-2-5ZM18.5 7l-2 5a2.7 2.7 0 0 0 4 0l-2-5Z" />
    </svg>
  );
}

export function IconDownload({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 4.5v10M8 11l4 3.5 4-3.5" />
      <path d="M4.5 16.5v2A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-2" />
    </svg>
  );
}

export function IconLeaf({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M19 5c-8 0-13 3.5-13 9.5 0 2.5 1.5 4.5 4 4.5 6 0 9.5-6 9-14Z" />
      <path d="M6.5 18.5C9 13 13 9 17.5 6.5" />
    </svg>
  );
}

export function IconHeart({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 19.5s-7.5-4.7-7.5-9.8A4 4 0 0 1 12 7.3a4 4 0 0 1 7.5 2.4c0 5.1-7.5 9.8-7.5 9.8Z" />
    </svg>
  );
}

export function IconClock({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconBasket({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 10h16l-1.6 9a1.5 1.5 0 0 1-1.5 1.2H7.1A1.5 1.5 0 0 1 5.6 19L4 10Z" />
      <path d="M8.5 10 12 4.5 15.5 10" />
      <path d="M9.5 13.5v3M14.5 13.5v3" />
    </svg>
  );
}

export function IconPlane({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M20 4.5 14.5 20l-3-6.5L4 10.5 20 4.5Z" />
      <path d="M11.5 13.5 20 4.5" />
    </svg>
  );
}

export function IconAlert({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 4.5 3.5 19.5h17L12 4.5Z" />
      <path d="M12 10.5v4M12 17.2v.05" />
    </svg>
  );
}

export function IconCheckCircle({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </svg>
  );
}

export function IconSearch({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m19 19-4.6-4.6" />
    </svg>
  );
}

/* Six-dot grip — the conventional "drag me" affordance. */
export function IconGrip({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="9" cy="6" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
    </svg>
  );
}

export function IconArrowRight({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function IconChevronUp({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m7 14 5-5 5 5" />
    </svg>
  );
}

export function IconChevronDown({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export function IconChevronLeft({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m14 7-5 5 5 5" />
    </svg>
  );
}

export function IconChevronRight({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m10 7 5 5-5 5" />
    </svg>
  );
}

export function IconDots({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="5.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPlus({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function IconMail({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function IconPhone({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M7.5 4.5h2.8l1.2 3.6-1.9 1.4a11.5 11.5 0 0 0 4.9 4.9l1.4-1.9 3.6 1.2v2.8a1.5 1.5 0 0 1-1.6 1.5C11.5 17.5 6.5 12.5 6 7.6A1.5 1.5 0 0 1 7.5 4.5Z" />
    </svg>
  );
}

export function IconUser({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5.5 20c.8-3.7 3.4-5.5 6.5-5.5s5.7 1.8 6.5 5.5" />
    </svg>
  );
}

export function IconX({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function IconPencil({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m5 19 .9-3.6L16.5 4.8a1.6 1.6 0 0 1 2.3 0l.4.4a1.6 1.6 0 0 1 0 2.3L8.6 18.1 5 19Z" />
      <path d="m14.8 6.5 2.7 2.7" />
    </svg>
  );
}

/* Decorative olive sprig used beside page titles (matches mockup flourish). */
export function OliveSprig({ size, className }: IconProps) {
  return (
    <svg
      width={size ?? 44}
      height={((size ?? 44) * 24) / 44}
      viewBox="0 0 44 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M2 20C12 16 26 10 42 4" />
      <path d="M10 16.5c-1-3-.2-5 1.8-6.4 1 2.8.4 5-1.8 6.4Z" />
      <path d="M17 13.6c-.8-3 .1-5.1 2.2-6.3.8 2.9 0 5-2.2 6.3Z" />
      <path d="M24 10.8c-.6-3 .4-5 2.5-6.1.6 2.9-.3 5-2.5 6.1Z" />
      <path d="M31 8c-.4-3 .7-4.9 2.9-5.8.4 2.9-.7 4.9-2.9 5.8Z" />
      <path d="M13 19.4c2.9-1.1 5-.6 6.6 1.2-2.7 1.2-4.9.8-6.6-1.2Z" />
      <path d="M20 16.4c2.9-.9 5-.3 6.5 1.6-2.8 1-5 .5-6.5-1.6Z" />
      <path d="M27 13.5c2.9-.7 5 0 6.3 2-2.8.9-5 .2-6.3-2Z" />
    </svg>
  );
}

export function IconSettings({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4M17.8 17.8l-1.4-1.4M7.6 7.6 6.2 6.2" />
    </svg>
  );
}

export function IconCalendarHeart({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      <path d="M12 17.5c-2-1.4-3-2.5-3-3.7a1.5 1.5 0 0 1 3-.5 1.5 1.5 0 0 1 3 .5c0 1.2-1 2.3-3 3.7Z" />
    </svg>
  );
}

export function IconLuggage({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="5" y="7.5" width="14" height="13" rx="2.5" />
      <path d="M9.5 7.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2.5" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconPalette({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 2-1 2-1.8 0-1.4-1.4-1.6-1.4-2.7 0-.8.7-1.3 1.6-1.3h1.4a4.9 4.9 0 0 0 4.9-4.9c0-3.6-3.6-6.3-8.5-6.3Z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="11.5" cy="7.5" r="1" />
      <circle cx="15.5" cy="9" r="1" />
    </svg>
  );
}

export function IconLink({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.5 1.5" />
      <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.5-1.5" />
    </svg>
  );
}

export function IconShield({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3.5 5.5 6v5.5c0 4 2.7 7.4 6.5 8.6 3.8-1.2 6.5-4.6 6.5-8.6V6Z" />
      <path d="m9.5 12 1.8 1.8 3.4-3.6" />
    </svg>
  );
}

export function IconLock({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14.5v2" />
    </svg>
  );
}

export function IconBed({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3.5 18.5v-11" />
      <path d="M3.5 11.5h17V18.5" />
      <path d="M3.5 15.5h17" />
      <path d="M7.5 11.5V9a1.5 1.5 0 0 1 1.5-1.5h8a3.5 3.5 0 0 1 3.5 3.5" />
      <circle cx="8" cy="13.5" r="0.01" />
    </svg>
  );
}
