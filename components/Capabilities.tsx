/* Les capacités de Prospecto : une grille « bento » de cartes en verre qui réagissent au curseur. */

function Glyph({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "digital":
      return (
        <svg viewBox="0 0 40 40" className="cap-glyph" aria-hidden="true">
          <rect x="6" y="8" width="28" height="20" rx="3" {...common} />
          <path d="M14 33h12M20 28v5" {...common} />
          <path d="M11 20l4-4 4 3 6-6" {...common} className="glyph-accent" />
        </svg>
      );
    case "needs":
      return (
        <svg viewBox="0 0 40 40" className="cap-glyph" aria-hidden="true">
          <circle cx="18" cy="18" r="9" {...common} />
          <path d="M25 25l8 8" {...common} />
          <circle cx="18" cy="18" r="3" className="glyph-accent" fill="currentColor" stroke="none" />
        </svg>
      );
    case "qualif":
      return (
        <svg viewBox="0 0 40 40" className="cap-glyph" aria-hidden="true">
          <path d="M8 10h24l-9 11v9l-6 3V21z" {...common} />
          <path d="M14 15h12" {...common} className="glyph-accent" />
        </svg>
      );
    case "message":
      return (
        <svg viewBox="0 0 40 40" className="cap-glyph" aria-hidden="true">
          <path d="M7 10h26v16H18l-7 6v-6H7z" {...common} />
          <path d="M12 16h14M12 21h9" {...common} className="glyph-accent" />
        </svg>
      );
    case "crm":
      return (
        <svg viewBox="0 0 40 40" className="cap-glyph" aria-hidden="true">
          <ellipse cx="20" cy="11" rx="12" ry="4" {...common} />
          <path d="M8 11v18c0 2.2 5.4 4 12 4s12-1.8 12-4V11M8 20c0 2.2 5.4 4 12 4s12-1.8 12-4" {...common} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className="cap-glyph" aria-hidden="true">
          <path d="M8 30l7-8 6 5 11-13" {...common} />
          <circle cx="32" cy="14" r="2.4" className="glyph-accent" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

const small = [
  { kind: "digital", title: "Présence digitale", text: "Site, mobile, sécurité, clarté." },
  { kind: "needs", title: "Besoins détectés", text: "Web ou automatisation." },
  { kind: "qualif", title: "Qualification", text: "Les prospects les plus pertinents d'abord." },
  { kind: "message", title: "Messages personnalisés", text: "Fondés sur des faits observés." },
  { kind: "crm", title: "CRM centralisé", text: "Prospects et statuts réunis." },
  { kind: "actions", title: "Suivi des actions", text: "Relances et échanges tracés." },
];

export default function Capabilities() {
  return (
    <section id="capacites" className="section overflow-hidden" aria-labelledby="caps-title">
      <div className="aura right-[-25vw] top-[10%]" data-parallax="-60" style={{ background: "radial-gradient(circle, rgba(121,210,214,0.2), transparent 65%)" }} />
      <div className="wrap relative">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 id="caps-title" className="h2" data-reveal>Les capacités de Prospecto</h2>
          <p className="lede" data-reveal="0.1">
            De la <strong className="kw">recherche de prospects par IA</strong> au suivi commercial.
          </p>
        </div>

        <ul className="bento mt-14">
          <li className="bento-lg" data-reveal>
            <article className="cap-card glass glass-strong" data-tilt="6" data-glow>
              <div className="depth-1">
                <h3 className="h3">Recherche d&apos;entreprises</h3>
                <p className="mt-2 text-[var(--text-dim)]">Par secteur, zone et critères.</p>
              </div>
              <div className="cap-map depth-2" aria-hidden="true">
                {Array.from({ length: 22 }, (_, i) => (
                  <span key={i} style={{ left: `${(i * 37) % 92 + 4}%`, top: `${(i * 53) % 78 + 10}%`, animationDelay: `${(i % 7) * 0.4}s` }} data-hot={i % 5 === 0} />
                ))}
              </div>
            </article>
          </li>
          <li className="bento-lg" data-reveal="0.08">
            <article className="cap-card glass" data-tilt="6" data-glow>
              <div className="depth-1">
                <h3 className="h3">Scoring commercial</h3>
                <p className="mt-2 text-[var(--text-dim)]">Un score par opportunité, justifié.</p>
              </div>
              <div className="depth-2 mt-auto space-y-3" aria-hidden="true">
                {[["Site web", 0.82], ["Agent IA", 0.54]].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="text-[0.8rem] text-[var(--text-dim)]">{k}</div>
                    <div className="meter mt-1.5"><i style={{ ["--v" as string]: v as number }} /></div>
                  </div>
                ))}
              </div>
            </article>
          </li>
          {small.map((c, i) => (
            <li key={c.kind} data-reveal={String((i % 3) * 0.06)}>
              <article className="cap-card cap-sm glass" data-tilt="10" data-glow>
                <Glyph kind={c.kind} />
                <h3 className="mt-auto text-[1.05rem] text-[var(--light)]" style={{ fontVariationSettings: '"wdth" 108' }}>{c.title}</h3>
                <p className="mt-1 text-[0.88rem] leading-snug text-[var(--text-dim)]">{c.text}</p>
              </article>
            </li>
          ))}
        </ul>
        <p className="illus-note mt-6">Les visuels sont des illustrations conceptuelles.</p>
      </div>
    </section>
  );
}
