import { useId } from "react";
import { symbolSvg } from "@/lib/pSymbol";

const SYMBOL = symbolSvg();

/** Le symbole Prospecto en version vectorielle (logo, rendu de secours). */
export default function PMark({ className, title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={SYMBOL.viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#c7d0dd" />
          <stop offset="0.72" stopColor="#6f86b3" />
          <stop offset="1" stopColor="#e9f0ff" />
        </linearGradient>
        <radialGradient id={`${id}c`} cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#bcd2ff" />
          <stop offset="1" stopColor="#6f86b3" />
        </radialGradient>
      </defs>
      <path d={SYMBOL.path} fill={`url(#${id}f)`} />
      <circle cx={SYMBOL.core.cx} cy={SYMBOL.core.cy} r={SYMBOL.core.r} fill={`url(#${id}c)`} />
    </svg>
  );
}
