"use client";

import { useEffect, useRef } from "react";

/**
 * Bord liquide entre deux sections : une surface d'eau qui ondule doucement
 * et se creuse davantage quand on fait défiler la page rapidement.
 */
export default function LiquidEdge({ color, flip = false }: { color: string; flip?: boolean }) {
  const path = useRef<SVGPathElement>(null);
  const highlight = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = path.current;
    const hl = highlight.current;
    if (!el || !hl) return;
    const W = 1440;
    const H = 120;
    const build = (t: number, amp: number) => {
      const pts: string[] = [];
      const top: string[] = [];
      const n = 24;
      for (let i = 0; i <= n; i++) {
        const x = (i / n) * W;
        const y =
          H * 0.55 +
          Math.sin(i * 0.55 + t * 0.9) * amp * 0.6 +
          Math.sin(i * 0.23 - t * 0.6) * amp +
          Math.sin(i * 1.3 + t * 1.7) * amp * 0.15;
        pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
        top.push(`${x.toFixed(1)} ${(y - 1).toFixed(1)}`);
      }
      el.setAttribute("d", `M0 ${H} L${pts.join(" L")} L${W} ${H} Z`);
      hl.setAttribute("d", `M${top.join(" L")}`);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    build(0, 14);
    if (reduce) return;

    let raf = 0;
    let visible = false;
    let amp = 14;
    let boost = 0;
    let lastY = window.scrollY;
    const t0 = performance.now();
    const tick = () => {
      raf = 0;
      if (!visible) return;
      const y = window.scrollY;
      boost = Math.min(40, boost * 0.92 + Math.abs(y - lastY) * 0.12);
      lastY = y;
      amp += (14 + boost - amp) * 0.08;
      build((performance.now() - t0) / 1000, amp);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      className="liquid-edge"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path ref={path} fill={color} />
      <path ref={highlight} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
    </svg>
  );
}
