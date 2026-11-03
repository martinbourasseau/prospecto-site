"use client";

import { useEffect } from "react";

/**
 * Comportements globaux légers, sans bibliothèque :
 * - reflet lumineux qui suit le pointeur sur les surfaces en verre ([data-glow]) ;
 * - apparitions au défilement ([data-reveal]) par IntersectionObserver et transitions CSS.
 */
export default function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-glow]");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    };
    if (fine) document.addEventListener("pointermove", onMove, { passive: true });

    let io: IntersectionObserver | undefined;
    if (document.documentElement.classList.contains("motion")) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const d = Number(el.dataset.reveal || 0);
        if (d) el.style.setProperty("--rd", `${d}s`);
        io!.observe(el);
      });
    }

    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, []);

  return null;
}
