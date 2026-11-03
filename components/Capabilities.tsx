"use client";

import { useState } from "react";

const caps = [
  { id: "search", title: "Recherche d'entreprises", text: "Repérer des entreprises selon un secteur, une zone et des critères définis.", zone: "list" },
  { id: "digital", title: "Analyse de présence digitale", text: "Examiner le site, son adaptation au mobile, sa sécurité et sa clarté.", zone: "digital" },
  { id: "needs", title: "Détection de besoins potentiels", text: "Relever les signaux qui suggèrent un besoin web ou d'automatisation.", zone: "needs" },
  { id: "score", title: "Scoring commercial", text: "Attribuer un score par type d'opportunité, avec sa justification.", zone: "score" },
  { id: "qualif", title: "Qualification des prospects", text: "Classer les entreprises pour concentrer l'effort sur les plus pertinentes.", zone: "list" },
  { id: "message", title: "Messages personnalisés", text: "Préparer une prise de contact fondée sur les observations réelles.", zone: "message" },
  { id: "crm", title: "Centralisation du CRM", text: "Réunir les prospects, leurs informations et leur statut au même endroit.", zone: "crm" },
  { id: "actions", title: "Suivi des actions commerciales", text: "Garder une trace des prochaines actions et des échanges.", zone: "crm" },
] as const;

type Zone = (typeof caps)[number]["zone"];

export default function Capabilities() {
  const [active, setActive] = useState<Zone | null>(null);
  const on = (z: Zone) => (active === z ? "true" : "false");

  return (
    <section id="capacites" className="section overflow-hidden" aria-labelledby="caps-title">
      <div className="aura right-[-25vw] top-[20%]" style={{ background: "radial-gradient(circle, rgba(121,210,214,0.22), transparent 65%)" }} />
      <div className="wrap relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 id="caps-title" className="h2" data-reveal>Les capacités de Prospecto</h2>
          <p className="lede" data-reveal="0.1">
            De la recherche de prospects par IA jusqu&apos;au suivi commercial, chaque capacité couvre une étape
            concrète de la prospection. Sélectionnez-en une pour voir où elle intervient.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_1.6fr] lg:gap-10">
          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1" data-reveal>
            {caps.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="cap-item"
                  aria-pressed={active === c.zone}
                  onClick={() => setActive((z) => (z === c.zone ? null : c.zone))}
                  onMouseEnter={() => setActive(c.zone)}
                  onFocus={() => setActive(c.zone)}
                >
                  <span className="mt-[0.55em] h-1.5 w-1.5 flex-none rounded-full bg-[var(--glacier)] shadow-[0_0_10px_var(--glacier)]" aria-hidden="true" />
                  <span>
                    <span className="block text-[0.98rem] text-[var(--light)]">{c.title}</span>
                    <span className="mt-1 block text-[0.86rem] leading-snug">{c.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <figure
            className="console glass glass-strong self-start rounded-[var(--radius-xl)] p-4 sm:p-6 lg:sticky lg:top-28"
            data-active={active ?? undefined}
            data-reveal="0.1"
            data-glow
            onMouseLeave={() => setActive(null)}
            aria-label="Illustration conceptuelle d'un tableau de bord d'agent de prospection"
          >
            <div className="flex items-center justify-between gap-3 px-1 pb-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <span className="tag"><span className="tag-dot" />Agent en cours d&apos;analyse</span>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.05fr_1fr]" aria-hidden="true">
              {/* Liste des entreprises */}
              <div className="zone bg-white/[0.03] p-4" data-on={on("list")}>
                <p className="text-[0.78rem] text-[var(--text-dim)]">Entreprises trouvées</p>
                <ul className="mt-3 space-y-2">
                  {[
                    ["Entreprise A", "Menuiserie", 0.86],
                    ["Entreprise B", "Cabinet de conseil", 0.71],
                    ["Entreprise C", "Restaurant", 0.58],
                    ["Entreprise D", "Commerce de détail", 0.4],
                  ].map(([n, s, v]) => (
                    <li key={n as string} className="rounded-xl bg-white/[0.04] px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2 text-[0.84rem]">
                        <span className="text-[var(--text)]">{n}</span>
                        <span className="text-[0.74rem] text-[var(--text-dim)]">{s}</span>
                      </div>
                      <div className="meter mt-2 !h-1"><i style={{ ["--v" as string]: v as number }} /></div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3">
                {/* Présence digitale */}
                <div className="zone bg-white/[0.03] p-4" data-on={on("digital")}>
                  <p className="text-[0.78rem] text-[var(--text-dim)]">Présence digitale — Entreprise A</p>
                  <ul className="mt-3 grid grid-cols-2 gap-2 text-[0.8rem]">
                    {[
                      ["Site web", "présent", true],
                      ["Mobile", "à revoir", false],
                      ["HTTPS", "actif", true],
                      ["Contact", "peu visible", false],
                    ].map(([k, v, ok]) => (
                      <li key={k as string} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-2">
                        <span className="text-[var(--text)]">{k}</span>
                        <span className={ok ? "text-[var(--tide)]" : "text-[#ffd29a]"}>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Besoins + score */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="zone bg-white/[0.03] p-4" data-on={on("needs")}>
                    <p className="text-[0.78rem] text-[var(--text-dim)]">Besoins détectés</p>
                    <div className="mt-3 flex flex-col gap-1.5">
                      <span className="tag !text-[0.74rem]">Refonte du site</span>
                      <span className="tag !text-[0.74rem]">Prise de rendez-vous</span>
                    </div>
                  </div>
                  <div className="zone bg-white/[0.03] p-4" data-on={on("score")}>
                    <p className="text-[0.78rem] text-[var(--text-dim)]">Scores</p>
                    <div className="mt-3 space-y-3 text-[0.74rem] text-[var(--text-dim)]">
                      <div>Web<div className="meter mt-1"><i style={{ ["--v" as string]: 0.82 }} /></div></div>
                      <div>IA<div className="meter mt-1"><i style={{ ["--v" as string]: 0.54 }} /></div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="zone bg-white/[0.03] p-4" data-on={on("message")}>
                <p className="text-[0.78rem] text-[var(--text-dim)]">Message préparé</p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-[92%] rounded-full bg-white/12" />
                  <div className="h-2 w-[78%] rounded-full bg-[rgba(156,188,255,0.3)]" />
                  <div className="h-2 w-[86%] rounded-full bg-white/12" />
                  <div className="h-2 w-[52%] rounded-full bg-white/12" />
                </div>
              </div>

              {/* CRM / actions */}
              <div className="zone bg-white/[0.03] p-4" data-on={on("crm")}>
                <p className="text-[0.78rem] text-[var(--text-dim)]">Suivi</p>
                <ul className="mt-3 space-y-1.5 text-[0.8rem]">
                  {[
                    ["Entreprise A", "à contacter"],
                    ["Entreprise B", "relance prévue"],
                    ["Entreprise C", "en échange"],
                  ].map(([n, s]) => (
                    <li key={n} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-2.5 py-2">
                      <span className="text-[var(--text)]">{n}</span>
                      <span className="text-[var(--glacier)]">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <figcaption className="illus-note mt-5 px-1">
              Illustration conceptuelle : données fictives, interface non accessible en ligne à ce jour.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
