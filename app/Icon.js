const paths = {
  screen: <><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M9 7l3 3-2 3 4 4"/></>,
  battery: <><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M8 10l-1.5 2.5h3L8 15"/></>,
  port: <><path d="M9 2v5M15 2v5"/><rect x="6" y="7" width="12" height="7" rx="2"/><path d="M12 14v4a3 3 0 0 0 3 3h3"/></>,
  water: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/></>,
  laptop: <><rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M2 19h20"/></>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/></>,
  shield: <><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
  badge: <><circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 8 5-3 5 3-1.5-8"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
  tag: <><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z"/><circle cx="7.5" cy="7.5" r="1.5"/></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>,
  sim: <><path d="M6 2h9l4 4v16H6z"/><rect x="9" y="11" width="7" height="7" rx="1"/></>,
  watch: <><rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l1-4h4l1 4M9 18l1 4h4l1-4M12 10v2l1.5 1.5"/></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></>,
  plug: <><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v5"/></>,
  tablet: <><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M11 18h2"/></>,
  data: <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>,
  swap: <><path d="M4 8h13l-3-3M20 16H7l3 3"/></>,
  pickup: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5"/>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></>,
  ring: <><circle cx="12" cy="9" r="6"/><circle cx="12" cy="9" r="3"/><path d="M12 15v7M9 22h6"/></>,
};

export default function Icon({ name, size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
