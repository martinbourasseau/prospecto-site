"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Arrow } from "./Icons";
import LiquidEdge from "./LiquidEdge";

const IDEA = "Trie mes tickets support par niveau d'urgence";
const MODULES = ["Identité", "Spécialisation", "Instructions", "Modules", "Mémoire"];

/** Démonstration conceptuelle : une idée entre dans l'atelier, un agent se matérialise. */
function AgentDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0); // 0 saisie, 1 création, 2 modules, 3 prêt

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(IDEA.length);
      setPhase(3);
      return;
    }
    let timers: number[] = [];
    let interval = 0;
    const clear = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
      window.clearInterval(interval);
    };
    const run = () => {
      clear();
      setTyped(0);
      setPhase(0);
      let i = 0;
      interval = window.setInterval(() => {
        i++;
        setTyped(i);
        if (i >= IDEA.length) {
          window.clearInterval(interval);
          timers.push(window.setTimeout(() => setPhase(1), 450));
          timers.push(window.setTimeout(() => setPhase(2), 1300));
          timers.push(window.setTimeout(() => setPhase(3), 3200));
          timers.push(window.setTimeout(run, 7600));
        }
      }, 42);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) run();
      else clear();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, []);

  return (
    <figure ref={root} className="agent-demo" data-phase={phase} aria-label="Démonstration conceptuelle : une idée devient un agent IA">
      <div className="agent-input" aria-hidden="true">
        <span className="agent-caret-wrap">
          {IDEA.slice(0, typed)}
          <span className="agent-caret" data-on={phase === 0} />
        </span>
        <span className="agent-go" data-active={phase >= 1}>
          <Arrow className="h-4 w-4" />
        </span>
      </div>

      <div className="agent-stage" aria-hidden="true">
        <svg viewBox="0 0 360 230" className="agent-links">
          {MODULES.map((_, i) => {
            const a = (-90 + (i * 360) / MODULES.length) * (Math.PI / 180);
            const x = 180 + Math.cos(a) * 120;
            const y = 115 + Math.sin(a) * 84;
            return <line key={i} x1="180" y1="115" x2={x} y2={y} className="agent-link" style={{ transitionDelay: `${i * 0.18}s` }} />;
          })}
        </svg>
        <div className="agent-core">
          <span />
        </div>
        {MODULES.map((m, i) => {
          const a = (-90 + (i * 360) / MODULES.length) * (Math.PI / 180);
          return (
            <span
              key={m}
              className="agent-module"
              style={{
                left: `${50 + (Math.cos(a) * 120 * 100) / 360}%`,
                top: `${50 + (Math.sin(a) * 84 * 100) / 230}%`,
                transitionDelay: `${0.15 + i * 0.18}s`,
              }}
            >
              {m}
            </span>
          );
        })}
      </div>

      <div className="agent-ready" aria-hidden="true">
        <span className="tag-dot" /> Agent prêt : tri des tickets support
      </div>
      <figcaption className="mt-4 text-[0.78rem] text-[#3a465a]">
        Démonstration conceptuelle. L&apos;atelier de création se trouve sur synatrap.com.
      </figcaption>
    </figure>
  );
}

const facts = [
  { t: "Un catalogue d'agents", d: "Spécialisés par métier : données, support client, ventes, marketing, e-commerce." },
  { t: "Installés chez vous", d: "Une application de bureau qui travaille sur les fichiers que vous lui confiez." },
  { t: "Sous votre contrôle", d: "Des outils déclarés, et votre accord avant toute action à risque élevé." },
  { t: "Créez le vôtre", d: "Un atelier sans code : identité, spécialisation, instructions, modules, mémoire." },
];

export default function Synatrap() {
  return (
    <section id="synatrap" className="syn" aria-labelledby="synatrap-title">
      <LiquidEdge color="#dfe5ee" />
      <div className="syn-body">
        <div className="syn-liquid" aria-hidden="true" />
        <div className="wrap relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <p className="mb-6 text-[0.9rem] text-[#3a465a]" data-reveal>
                SYNATRAP · une autre marque de notre écosystème
              </p>
              <h2 id="synatrap-title" className="syn-title" data-reveal>
                Votre prochain agent IA commence ici.
              </h2>
              <p className="mt-8 max-w-[44ch] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-[#2a3446]" data-reveal="0.1">
                Avec SYNATRAP, transformez vos besoins en <strong className="font-medium text-[#070b14]">agents IA personnalisés</strong> et
                automatisez ce qui compte vraiment pour votre activité.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5" data-reveal="0.15">
                <a href={site.synatrap.url} className="btn btn-dark syn-cta" data-magnetic>
                  Découvrir SYNATRAP
                  <Arrow />
                </a>
                <a href={site.synatrap.url} className="syn-link">synatrap.com</a>
              </div>
            </div>
            <div data-reveal="0.1">
              <AgentDemo />
            </div>
          </div>

          <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f, i) => (
              <li key={f.t} className="frost p-6" data-reveal={String(i * 0.06)} data-tilt="6">
                <h3 className="text-[1.08rem] text-[#070b14]" style={{ fontVariationSettings: '"wdth" 110' }}>{f.t}</h3>
                <p className="mt-2 text-[0.92rem] leading-snug text-[#3a465a]">{f.d}</p>
              </li>
            ))}
          </ul>

          <div className="syn-pair mt-16" data-reveal>
            <div>
              <p className="syn-pair-name">PROSPECTO</p>
              <p className="syn-pair-text">Un agent IA spécialisé dans la prospection commerciale.</p>
            </div>
            <span className="syn-pair-link" aria-hidden="true" />
            <div>
              <p className="syn-pair-name">SYNATRAP</p>
              <p className="syn-pair-text">Pour concevoir des agents IA adaptés à vos autres besoins.</p>
            </div>
          </div>
        </div>
      </div>
      <LiquidEdge color="#dfe5ee" flip />
    </section>
  );
}
