// ══════════════════════════════════════════════════════════════════════
// SazónPOS — SVG Icon System
// ══════════════════════════════════════════════════════════════════════

const Icon = ({ d, size = 20, className = "", strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const Icons = {
  home:        (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />,
  grid:        (p) => <Icon {...p} d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />,
  cart:        (p) => <Icon {...p} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18" />,
  truck:       (p) => <Icon {...p} d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />,
  chart:       (p) => <Icon {...p} d="M18 20V10M12 20V4M6 20v-6" />,
  settings:    (p) => <Icon {...p} d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />,
  search:      (p) => <Icon {...p} d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />,
  bell:        (p) => <Icon {...p} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />,
  user:        (p) => <Icon {...p} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  plus:        (p) => <Icon {...p} d="M12 5v14M5 12h14" />,
  minus:       (p) => <Icon {...p} d="M5 12h14" />,
  trash:       (p) => <Icon {...p} d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />,
  check:       (p) => <Icon {...p} d="M20 6L9 17l-5-5" />,
  x:           (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />,
  banknote:    (p) => <Icon {...p} d="M2 7l10-4 10 4M4 7v10M20 7v10M8 7v10M12 7v10M16 7v10M4 12h16" />,
  qr:          (p) => <Icon {...p} d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm13 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm-4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2z" />,
  receipt:     (p) => <Icon {...p} d="M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2-4-2zM8 10h8M8 14h4" />,
  store:       (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />,
  utensils:    (p) => <Icon {...p} d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2c-1.66 0-3 1.34-3 3v5c0 1.66 1.34 3 3 3v7" />,
  clock:       (p) => <Icon {...p} d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />,
  star:        (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  zap:         (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  package:     (p) => <Icon {...p} d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />,
  trendingUp:  (p) => <Icon {...p} d="M23 6l-9.5 9.5-5-5L1 18" />,
  dollarSign:  (p) => <Icon {...p} d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  printer:     (p) => <Icon {...p} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />,
  chevronLeft: (p) => <Icon {...p} d="M15 18l-6-6 6-6" />,
};