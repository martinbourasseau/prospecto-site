"use client";

import { useEffect, useState } from "react";
import PMark from "./PMark";

const links = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#prospecto", label: "Prospecto" },
  { href: "/#solutions", label: "Solutions IA" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav-shell">
      <div className="wrap">
        <nav aria-label="Navigation principale" className="nav glass" data-scrolled={scrolled || open} data-glow>
          <a href="/#accueil" className="flex items-center gap-3" aria-label="Prospecto, retour à l'accueil">
            <PMark className="h-7 w-auto" />
            <span className="wordmark text-[0.78rem] text-[var(--light)]" style={{ letterSpacing: "0.34em" }}>
              Prospecto
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a className="nav-link" href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="/#contact" className="btn btn-primary hidden !min-h-[44px] !px-5 text-[0.9rem] sm:inline-flex" data-glow>
              Parlons de votre projet
            </a>
            <button
              type="button"
              className="btn btn-glass glass !min-h-[44px] !px-4 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
              <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
                {open ? <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /> : <path d="M3.5 7h13M3.5 13h13" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </nav>

        <div
          id="menu-mobile"
          hidden={!open}
          className="glass glass-strong pointer-events-auto mt-2 rounded-[24px] p-3 lg:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  className="block rounded-2xl px-4 py-3.5 text-[1.05rem] text-[var(--light)] hover:bg-white/5"
                  href={l.href}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full">
            Parlons de votre projet
          </a>
        </div>
      </div>
    </header>
  );
}
