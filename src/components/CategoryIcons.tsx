import type { FC, SVGProps } from 'react';

type IconComponent = FC<SVGProps<SVGSVGElement>>;

const DigitalCameraIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="13" rx="2" />
    <path d="M7 7 L7 5 Q7 4, 8 4 L11 4 Q12 4, 12 5 L12 7" />
    <circle cx="12" cy="13.5" r="4" />
    <circle cx="12" cy="13.5" r="2" />
    <line x1="3.5" y1="9" x2="3.5" y2="18" />
    <circle cx="18" cy="5.5" r="1.5" />
    <line x1="17.5" y1="4" x2="18.5" y2="4" />
  </svg>
);

const FilmCameraIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="6" width="20" height="14" rx="1.5" />
    <path d="M4 6 L4 3.5 Q4 3, 4.5 3 L6.5 3 Q7 3, 7 3.5 L7 6" />
    <path d="M17 6 L17 4 Q17 3, 17.5 3 L19.5 3 Q20 3, 20 4 L20 6" />
    <line x1="20" y1="3.5" x2="22" y2="2.5" />
    <circle cx="22" cy="2.5" r="0.6" fill="currentColor" />
    <rect x="9.5" y="3.5" width="5" height="2.5" rx="0.5" />
    <circle cx="11" cy="13" r="3.5" />
    <circle cx="11" cy="13" r="1.5" />
    <rect x="17" y="8.5" width="3" height="2" rx="0.5" />
  </svg>
);

const LensesIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M9 8 Q10 7, 11 8" />
  </svg>
);

const LensFiltersIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="5.5" />
    <line x1="8.5" y1="9" x2="11" y2="7.5" />
    <line x1="10" y1="11" x2="13" y2="9" />
    <line x1="11.5" y1="13" x2="15" y2="10.5" />
  </svg>
);

const FlashIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="6" y="2" width="12" height="7" rx="1.5" />
    <line x1="9" y1="4" x2="9" y2="7" />
    <line x1="12" y1="4" x2="12" y2="7" />
    <line x1="15" y1="4" x2="15" y2="7" />
    <path d="M8 9 L8 15 L16 15 L16 9" />
    <rect x="10" y="10.5" width="4" height="2.5" rx="0.5" />
    <path d="M6 15 L6 17 Q6 18, 7 18 L17 18 Q18 18, 18 17 L18 15" />
    <rect x="10.5" y="18" width="3" height="1.5" rx="0.3" />
    <path d="M13 20.5 L11.5 22.5 L13 22 L11.5 24" />
  </svg>
);

const TripodIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="8" y="2" width="8" height="3" rx="1" />
    <circle cx="12" cy="3.5" r="0.7" fill="currentColor" />
    <line x1="12" y1="5" x2="12" y2="10" />
    <rect x="10" y="10" width="4" height="2" rx="0.5" />
    <line x1="10" y1="12" x2="3" y2="22" />
    <line x1="12" y1="12" x2="12" y2="22" />
    <line x1="14" y1="12" x2="21" y2="22" />
    <circle cx="3" cy="22" r="0.7" fill="currentColor" />
    <circle cx="12" cy="22" r="0.7" fill="currentColor" />
    <circle cx="21" cy="22" r="0.7" fill="currentColor" />
  </svg>
);

const MountsSupportsIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 3 L4 14 L15 14" />
    <circle cx="4" cy="6" r="1" />
    <circle cx="4" cy="10" r="1" />
    <circle cx="10" cy="14" r="1" />
    <path d="M15 14 L19 8" />
    <circle cx="15" cy="14" r="1.5" />
    <path d="M17.5 6.5 L19 8 L21 6" />
    <circle cx="19" cy="8" r="1.5" />
    <line x1="20.5" y1="9" x2="22" y2="10" />
    <path d="M2 17 L6 17" />
    <line x1="4" y1="15" x2="4" y2="17" />
  </svg>
);

const MicrophoneIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="8" y="2" width="8" height="12" rx="4" />
    <line x1="9.5" y1="5" x2="14.5" y2="5" />
    <line x1="9" y1="7.5" x2="15" y2="7.5" />
    <line x1="9.5" y1="10" x2="14.5" y2="10" />
    <path d="M5 11 Q5 18, 12 18 Q19 18, 19 11" />
    <line x1="12" y1="18" x2="12" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);

const SDCardIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4 L4 20 Q4 21, 5 21 L19 21 Q20 21, 20 20 L20 8 L16 4 Z" />
    <path d="M16 4 L16 8 L20 8" />
    <line x1="8" y1="15" x2="8" y2="18" />
    <line x1="10.5" y1="15" x2="10.5" y2="18" />
    <line x1="13" y1="15" x2="13" y2="18" />
    <line x1="15.5" y1="15" x2="15.5" y2="18" />
    <rect x="7" y="7" width="6" height="4" rx="0.5" />
    <rect x="5" y="6" width="1" height="3" rx="0.3" />
  </svg>
);

const DroneIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="10" width="6" height="4" rx="1.5" />
    <circle cx="12" cy="16" r="1.5" />
    <line x1="11" y1="14" x2="11" y2="15" />
    <line x1="13" y1="14" x2="13" y2="15" />
    <line x1="9" y1="11" x2="4" y2="8" />
    <line x1="15" y1="11" x2="20" y2="8" />
    <line x1="9" y1="13" x2="4" y2="16" />
    <line x1="15" y1="13" x2="20" y2="16" />
    <path d="M2 7 Q4 5, 6 7 Q4 9, 2 7Z" />
    <path d="M18 7 Q20 5, 22 7 Q20 9, 18 7Z" />
    <path d="M2 15 Q4 13, 6 15 Q4 17, 2 15Z" />
    <path d="M18 15 Q20 13, 22 15 Q20 17, 18 15Z" />
    <circle cx="4" cy="8" r="0.5" fill="currentColor" />
    <circle cx="20" cy="8" r="0.5" fill="currentColor" />
    <circle cx="4" cy="16" r="0.5" fill="currentColor" />
    <circle cx="20" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

const DigitalAccessoriesIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="8" y="2" width="8" height="5" rx="1" />
    <line x1="10.5" y1="4" x2="10.5" y2="5.5" />
    <line x1="13.5" y1="4" x2="13.5" y2="5.5" />
    <path d="M12 7 L12 10" />
    <path d="M12 10 Q12 12, 8 14" />
    <path d="M12 10 Q12 12, 16 14" />
    <rect x="5" y="14" width="6" height="4" rx="0.5" />
    <line x1="4" y1="15.5" x2="4" y2="16.5" />
    <line x1="7" y1="15.5" x2="7" y2="16.5" />
    <line x1="8.5" y1="15.5" x2="8.5" y2="16.5" />
    <rect x="14" y="14" width="6" height="4" rx="0.5" />
    <line x1="16" y1="18" x2="16" y2="20" />
    <line x1="18" y1="18" x2="18" y2="20" />
    <path d="M8 20 L7 22 L8.5 21.5 L7.5 23" />
  </svg>
);

const FilmAccessoriesIcon: IconComponent = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="11" height="16" rx="2" />
    <circle cx="8.5" cy="10" r="3" />
    <circle cx="8.5" cy="10" r="1" />
    <line x1="8.5" y1="7" x2="8.5" y2="8" />
    <line x1="8.5" y1="12" x2="8.5" y2="13" />
    <line x1="5.5" y1="10" x2="6.5" y2="10" />
    <line x1="10.5" y1="10" x2="11.5" y2="10" />
    <path d="M14 6 L19 6 Q20 6, 20 7 L20 19 Q20 20, 19 20 L14 20" />
    <rect x="15" y="8" width="1.5" height="1" rx="0.3" />
    <rect x="15" y="11" width="1.5" height="1" rx="0.3" />
    <rect x="15" y="14" width="1.5" height="1" rx="0.3" />
    <rect x="15" y="17" width="1.5" height="1" rx="0.3" />
    <line x1="5" y1="4" x2="12" y2="4" />
  </svg>
);

const CATEGORY_ICONS: Record<string, IconComponent> = {
  'Digital Camera': DigitalCameraIcon,
  'Film Camera': FilmCameraIcon,
  'Lenses': LensesIcon,
  'Lens Filters': LensFiltersIcon,
  'Flash': FlashIcon,
  'Tripod': TripodIcon,
  'Mounts/Supports': MountsSupportsIcon,
  'Microphones': MicrophoneIcon,
  'SD Card': SDCardIcon,
  'Drone': DroneIcon,
  'Digital Accessories': DigitalAccessoriesIcon,
  'Film Accessories': FilmAccessoriesIcon,
};

export function getCategoryIcon(name: string): IconComponent | null {
  return CATEGORY_ICONS[name] ?? null;
}
