import { P_PATH, P_VIEWBOX } from "@/lib/pShape";
import { useId } from "react";

/** Le P de Prospecto en verre, version vectorielle (logo, rendu de secours). */
export default function PMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={P_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.38" stopColor="#c7d0dd" />
          <stop offset="0.7" stopColor="#6f86b3" />
          <stop offset="1" stopColor="#e9f0ff" />
        </linearGradient>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#9cbcff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d={P_PATH} fill={`url(#${id}f)`} fillRule="evenodd" />
      <path d={P_PATH} fill="none" stroke={`url(#${id}e)`} strokeWidth="0.8" fillRule="evenodd" />
    </svg>
  );
}
