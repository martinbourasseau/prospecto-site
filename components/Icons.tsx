export function Arrow({ className = "icon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Mail({ className = "icon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" />
      <path d="m3.5 6 6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Copy({ className = "icon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6.5" y="6.5" width="10" height="10" rx="2.2" />
      <path d="M13.5 6.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v7A1.5 1.5 0 0 0 5 13.5h1.5" />
    </svg>
  );
}
export function External({ className = "icon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 13 14.5 5.5M8.5 5.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
