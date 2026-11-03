"use client";

import { useEffect } from "react";

/**
 * Comportements globaux, sans bibliothèque :
 * - reflet lumineux qui suit le pointeur sur les surfaces en verre ([data-glow]) ;
 * - boutons magnétiques ([data-magnetic]) et cartes inclinables en 3D ([data-tilt]) ;
 * - halo de lumière qui suit le curseur sur ordinateur ;
 * - apparitions au défilement ([data-reveal]) et parallaxe douce ([data-parallax]).
 */
export default function Interactions() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const motion = document.documentElement.classList.contains("motion");
    const cleanups: Array<() => void> = [];

    // Halo du curseur
    let halo: HTMLDivElement | null = null;
    if (fine && motion) {
      halo = document.createElement("div");
      halo.className = "cursor-halo";
      halo.setAttribute("aria-hidden", "true");
      document.body.appendChild(halo);
      cleanups.push(() => halo?.remove());
    }

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement) => {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };
    const resetMagnet = (el: HTMLElement) => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };

    const update = () => {
      frame = 0;
      const e = lastEvent;
      if (!e) return;
      if (halo) halo.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const target = e.target as HTMLElement | null;

      const glowEl = target?.closest<HTMLElement>("[data-glow]");
      if (glowEl) {
        const r = glowEl.getBoundingClientRect();
        glowEl.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        glowEl.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      }

      if (!motion) return;
      const tiltEl = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tilted && tilted !== tiltEl) resetTilt(tilted);
      tilted = tiltEl;
      if (tiltEl) {
        const r = tiltEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const k = Number(tiltEl.dataset.tilt || 8);
        tiltEl.style.setProperty("--rx", `${(-py * k).toFixed(2)}deg`);
        tiltEl.style.setProperty("--ry", `${(px * k).toFixed(2)}deg`);
      }

      const magEl = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== magEl) resetMagnet(magnet);
      magnet = magEl;
      if (magEl) {
        const r = magEl.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magEl.style.setProperty("--mx", `${(dx * 0.18).toFixed(1)}px`);
        magEl.style.setProperty("--my", `${(dy * 0.28).toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      if (tilted) resetTilt(tilted);
      if (magnet) resetMagnet(magnet);
      tilted = magnet = null;
      if (halo) halo.style.opacity = "0";
    };
    const onEnter = () => {
      if (halo) halo.style.opacity = "";
    };
    if (fine) {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.documentElement.addEventListener("pointerenter", onEnter);
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.documentElement.removeEventListener("pointerenter", onEnter);
        cancelAnimationFrame(frame);
      });
    }

    // Apparitions au défilement
    if (motion) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const d = Number(el.dataset.reveal || 0);
        if (d) el.style.setProperty("--rd", `${d}s`);
        io.observe(el);
      });
      cleanups.push(() => io.disconnect());

      // Parallaxe douce : uniquement sur les éléments visibles.
      const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      if (layers.length) {
        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            const vh = window.innerHeight;
            for (const el of layers) {
              const r = el.parentElement!.getBoundingClientRect();
              if (r.bottom < 0 || r.top > vh) continue;
              const progress = (r.top + r.height / 2 - vh / 2) / vh;
              el.style.transform = `translate3d(0, ${(progress * Number(el.dataset.parallax)).toFixed(1)}px, 0)`;
            }
          });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
      }
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
