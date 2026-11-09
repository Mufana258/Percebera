import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16.5 16.5 4 4" />
  </IconBase>
);

export const ArrowRightIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </IconBase>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  </IconBase>
);

export const ArrowUpRightIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </IconBase>
);

export const SwapIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 8h13" />
    <path d="m14 5 3 3-3 3" />
    <path d="M20 16H7" />
    <path d="m10 13-3 3 3 3" />
  </IconBase>
);

export const CheckIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m5 12 4 4L19 6" />
  </IconBase>
);

export const CheckCircleIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </IconBase>
);

export const StarIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3.5 14.6 9l6 .8-4.4 4.2 1.1 6-5.3-2.9L6.7 20l1.1-6L3.4 9.8l6-.8Z" />
  </IconBase>
);

export const MapPinIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </IconBase>
);

export const ShieldIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3 19 6v5.5c0 4.6-3 7.8-7 9.5-4-1.7-7-4.9-7-9.5V6Z" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const BookmarkIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <IconBase {...props} fill={filled ? "currentColor" : "none"}>
    <path d="M6 4h12v17l-6-4-6 4Z" />
  </IconBase>
);

export const ClockIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </IconBase>
);

export const UsersIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3.2 2.4-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.9" />
    <path d="M17.5 14.7c1.9.6 3 2.4 3 5.3" />
  </IconBase>
);

export const PlusIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 5v14M5 12h14" />
  </IconBase>
);

export const CloseIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </IconBase>
);

export const MenuIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </IconBase>
);

export const ChevronDownIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);

export const AlertIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 4 2.8 20h18.4Z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.4" r=".7" fill="currentColor" stroke="none" />
  </IconBase>
);

export const GlobeIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.5-4-9s1.4-6.6 4-9Z" />
  </IconBase>
);

export const MailIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 6 8 7 8-7" />
  </IconBase>
);

export const LinkedInIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M8 10.5V17" />
    <circle cx="8" cy="7.7" r=".8" fill="currentColor" stroke="none" />
    <path d="M12 17v-3.6a2.2 2.2 0 0 1 4.4 0V17" />
    <path d="M12 10.5V17" />
  </IconBase>
);

export const VideoIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="3" y="6" width="12" height="12" rx="2" />
    <path d="m15 10 6-3v10l-6-3" />
  </IconBase>
);

export const FilterIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </IconBase>
);

export const PauseIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 5v14M15 5v14" />
  </IconBase>
);

export const PlayIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m8 5 11 7-11 7Z" />
  </IconBase>
);

export const QuoteIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 11H5.5A1.5 1.5 0 0 1 4 9.5v-2A1.5 1.5 0 0 1 5.5 6H8a1 1 0 0 1 1 1v6c0 2.5-1.4 4.2-4 5" />
    <path d="M19 11h-3.5A1.5 1.5 0 0 1 14 9.5v-2A1.5 1.5 0 0 1 15.5 6H18a1 1 0 0 1 1 1v6c0 2.5-1.4 4.2-4 5" />
  </IconBase>
);

export const InfoIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none" />
  </IconBase>
);

export const SparkIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </IconBase>
);

export const ShieldCheckIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3 19 6v5.5c0 4.6-3 7.8-7 9.5-4-1.7-7-4.9-7-9.5V6Z" />
    <path d="m9 11.8 2 2 4.2-4.2" />
  </IconBase>
);

export const WhatsAppIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7Z" />
    <path d="M8.8 8.1c.2-.4.5-.4.8-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.5.8 1.1 1.4 1.9 1.9.2.2.4.1.5 0l.6-.7c.2-.2.3-.2.6-.1l1.7.8c.2.1.4.2.4.4 0 .3-.1 1.6-1 2.2-.6.4-1.4.6-2.3.3-1-.3-2.6-1.1-4-2.6-1.2-1.3-1.9-2.8-2.1-3.7-.2-.9 0-1.6.3-2Z" />
  </IconBase>
);

export const CopyIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
  </IconBase>
);

