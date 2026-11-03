"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    id: "recherche",
    title: "Recherche",
    h3: "Recherche intelligente d'entreprises",
    text: "L'agent trouve les entreprises qui correspondent à vos critères et à votre zone, sources à l'appui.",
  },
  {
    id: "analyse",
    title: "Analyse",
    h3: "Analyse de la présence digitale",
    text: "Site, mobile, sécurité, contact : il lit ce que chaque entreprise montre en ligne.",
  },
  {
    id: "scoring",
    title: "Scoring",
    h3: "Qualification et scoring des prospects",
    text: "Deux scores distincts — site web et agent IA —, chacun avec sa justification.",
  },
  {
    id: "personnalisation",
    title: "Personnalisation",
    h3: "Messages commerciaux personnalisés",
    text: "Un message préparé à partir de ce qui a été observé. Jamais générique.",
  },
  {
    id: "suivi",
    title: "Suivi",
    h3: "Suivi centralisé des prospects",
    text: "Statuts, prochaines actions, échanges : conçu pour tout réunir au même endroit.",
  },
];

function Console({ active }: { active: number }) {
  return (
    <figure className="console-demo glass glass-strong" data-step={active} aria-label="Illustration conceptuelle du fonctionnement de l'agent Prospecto">
      {/* Chaîne de traitement */}
      <div className="pipeline" aria-hidden="true">
        <div className="pipeline-track">
          <i style={{ transform: `scaleX(${active / (steps.length - 1)})` }} />
        </div>
        {steps.map((s, i) => (
          <span key={s.id} className="pipeline-node" data-on={i <= active} data-current={i === active}>
            <b />
            <em>{s.title}</em>
          </span>
        ))}
      </div>

      <div className="console-stage" aria-hidden="true">
        {/* 0 — Recherche */}
        <div className="stage" data-show={active === 0}>
          <div className="flex flex-wrap gap-2">
            {["Secteur", "Zone", "Taille", "Présence en ligne"].map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
          <div className="mt-5 grid items-center gap-5 sm:grid-cols-[150px_1fr]">
            <svg viewBox="0 0 200 200" className="mx-auto w-[120px] sm:w-full">
              <defs>
                <linearGradient id="sweepG" x1="0" x2="1">
                  <stop offset="0" stopColor="#9cbcff" stopOpacity="0" />
                  <stop offset="1" stopColor="#9cbcff" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {[32, 64, 96].map((r) => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.1)" />)}
              <g className="radar-sweep" style={{ transformOrigin: "100px 100px" }}>
                <path d="M100 100 L196 100 A96 96 0 0 0 168 32 Z" fill="url(#sweepG)" />
              </g>
              {[[62, 40], [130, 62], [82, 120], [150, 132], [48, 150]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="#e6eeff" className="radar-dot" style={{ animationDelay: `${i * 0.35}s` }} />
              ))}
            </svg>
            <ul className="space-y-2">
              {["Entreprise A", "Entreprise B", "Entreprise C"].map((n, i) => (
                <li key={n} className="row-in flex items-center justify-between rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-[0.86rem]" style={{ animationDelay: `${0.2 + i * 0.25}s` }}>
                  <span>{n}</span>
                  <span className="text-[0.75rem] text-[var(--tide)]">trouvée</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 1 — Analyse */}
        <div className="stage" data-show={active === 1}>
          <p className="text-[0.8rem] text-[var(--text-dim)]">Entreprise A</p>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 text-[0.88rem]">
            {[
              ["Site web", "présent", true],
              ["Mobile", "à revoir", false],
              ["HTTPS", "actif", true],
              ["Contact", "peu visible", false],
            ].map(([k, v, ok], i) => (
              <li key={k as string} className="row-in rounded-xl bg-white/[0.04] p-3.5" style={{ animationDelay: `${i * 0.18}s` }}>
                <span className="block text-[var(--text)]">{k}</span>
                <span className={`mt-1 block text-[0.8rem] ${ok ? "text-[var(--tide)]" : "text-[#ffd29a]"}`}>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2 — Scoring */}
        <div className="stage" data-show={active === 2}>
          <div className="space-y-5">
            {[
              ["Site web", "élevé", 0.82, "Site non adapté au mobile."],
              ["Agent IA", "modéré", 0.54, "Rendez-vous gérés par téléphone."],
            ].map(([k, lvl, v, why]) => (
              <div key={k as string}>
                <div className="flex items-baseline justify-between text-[0.92rem]">
                  <span>{k}</span>
                  <span className="text-[var(--glacier)]">{lvl}</span>
                </div>
                <div className="meter mt-2"><i className="meter-fill" style={{ ["--v" as string]: v as number }} /></div>
                <p className="mt-2 text-[0.8rem] text-[var(--text-dim)]">{why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3 — Personnalisation */}
        <div className="stage" data-show={active === 3}>
          <p className="text-[0.8rem] text-[var(--text-dim)]">Brouillon préparé</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--text)]">
            Bonjour, en découvrant <mark className="kw-mark">votre atelier</mark>, j&apos;ai remarqué que{" "}
            <mark className="kw-mark">votre site s&apos;affiche mal sur mobile</mark>. Un court échange pour{" "}
            <mark className="kw-mark">faciliter vos demandes de devis</mark> ?
          </p>
          <div className="mt-4 flex gap-2">
            <span className="tag"><span className="tag-dot" />Personnalisé</span>
            <span className="tag">À relire avant envoi</span>
          </div>
        </div>

        {/* 4 — Suivi */}
        <div className="stage" data-show={active === 4}>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              ["À contacter", ["Entreprise A", "Entreprise B"]],
              ["Contacté", ["Entreprise C"]],
              ["En échange", ["Entreprise D"]],
            ].map(([col, items], ci) => (
              <div key={col as string} className="min-w-0">
                <p className="truncate text-[0.74rem] text-[var(--text-dim)]">{col}</p>
                <div className="mt-2 space-y-2">
                  {(items as string[]).map((it, i) => (
                    <div key={it} className="row-in truncate rounded-xl bg-white/[0.05] p-2.5 text-[0.8rem]" style={{ animationDelay: `${ci * 0.2 + i * 0.12}s` }}>
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[rgba(121,210,214,0.07)] px-3.5 py-2.5 text-[0.84rem] shadow-[inset_0_0_0_1px_rgba(121,210,214,0.2)]">
            <span>Prochaine action : relance</span>
            <span className="text-[var(--tide)]">à planifier</span>
          </div>
        </div>
      </div>

      <figcaption className="illus-note mt-5">Illustration conceptuelle — données fictives</figcaption>
    </figure>
  );
}

export default function Steps() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // Sur mobile, la console occupe le haut de l'écran : l'étape active est celle lue plus bas.
      { rootMargin: window.matchMedia("(max-width: 1023px)").matches ? "-66% 0px -26% 0px" : "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="fonctionnement" className="section !pb-0" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="max-w-3xl">
          <h2 id="steps-title" className="h2" data-reveal>Comment fonctionne Prospecto</h2>
          <p className="lede mt-6" data-reveal="0.1">
            Cinq étapes. <span className="text-[var(--light)]">L&apos;agent travaille, vous gardez la relation.</span>
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="sticky top-[84px] z-10 lg:order-2 lg:top-[18vh] lg:self-start">
            <Console active={active} />
          </div>

          <ol className="relative lg:order-1">
            {steps.map((s, i) => (
              <li
                key={s.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className="step-block"
                data-active={active === i}
              >
                <p className="step-num" aria-hidden="true" data-n={String(i + 1).padStart(2, "0")} />
                <h3 className="h3 mt-3">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {s.h3}
                </h3>
                <p className="mt-3 max-w-[40ch] text-[1.02rem] text-[var(--text-dim)]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
