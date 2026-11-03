/* Section « Comment fonctionne Prospecto » — chaque étape a sa propre composition. */

function Note() {
  return <p className="illus-note mt-4">Illustration conceptuelle</p>;
}

function SearchVisual() {
  const dots = [
    [62, 38], [118, 64], [84, 112], [150, 128], [44, 150], [172, 52], [128, 168], [98, 84],
  ];
  return (
    <figure className="glass p-5 sm:p-7" data-glow>
      <div className="flex flex-wrap gap-2">
        {["Secteur d'activité", "Zone géographique", "Taille d'entreprise", "Présence en ligne"].map((c) => (
          <span key={c} className="tag">{c}</span>
        ))}
      </div>
      <div className="mt-6 grid items-center gap-6 sm:grid-cols-[200px_1fr]">
        <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[220px]" aria-hidden="true">
          <defs>
            <radialGradient id="radarFill">
              <stop offset="0" stopColor="#9cbcff" stopOpacity="0.18" />
              <stop offset="1" stopColor="#9cbcff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sweep" x1="0" x2="1">
              <stop offset="0" stopColor="#9cbcff" stopOpacity="0" />
              <stop offset="1" stopColor="#9cbcff" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#radarFill)" />
          {[32, 64, 96].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.1)" />
          ))}
          <path d="M100 4v192M4 100h192" stroke="rgba(255,255,255,0.06)" />
          <g className="origin-center motion-safe:animate-[spin_7s_linear_infinite]" style={{ transformOrigin: "100px 100px" }}>
            <path d="M100 100 L196 100 A96 96 0 0 0 168 32 Z" fill="url(#sweep)" />
          </g>
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#e6eeff" opacity={0.35 + (i % 3) * 0.2}>
              <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2.4 + (i % 4) * 0.6}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
        <ul className="space-y-2.5 text-[0.9rem]">
          {[
            ["Site web de l'entreprise", "consultée"],
            ["Fiche d'établissement publique", "consultée"],
            ["Annuaire professionnel", "consultée"],
          ].map(([a, b]) => (
            <li key={a} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.035] px-4 py-3">
              <span className="text-[var(--text)]">{a}</span>
              <span className="flex-none text-[0.78rem] text-[var(--tide)]">{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <Note />
    </figure>
  );
}

function ScoreVisual() {
  return (
    <figure className="glass glass-strong p-5 sm:p-7" data-glow>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[var(--light)]">Entreprise exemple</p>
        <p className="text-[0.8rem] text-[var(--text-dim)]">Artisan · zone définie</p>
      </div>
      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-baseline justify-between text-[0.92rem]">
            <span className="text-[var(--text)]">Création ou refonte de site web</span>
            <span className="text-[var(--glacier)]">élevé</span>
          </div>
          <div className="meter mt-2.5"><i style={{ ["--v" as string]: 0.82 }} /></div>
          <p className="mt-2.5 text-[0.85rem] text-[var(--text-dim)]">
            Justification : site non adapté au mobile, informations de contact difficiles à trouver.
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between text-[0.92rem]">
            <span className="text-[var(--text)]">Agent IA ou automatisation</span>
            <span className="text-[var(--silver)]">modéré</span>
          </div>
          <div className="meter mt-2.5"><i style={{ ["--v" as string]: 0.54 }} /></div>
          <p className="mt-2.5 text-[0.85rem] text-[var(--text-dim)]">
            Justification : prise de rendez-vous uniquement par téléphone, demandes répétitives.
          </p>
        </div>
      </div>
      <Note />
    </figure>
  );
}

function MessageVisual() {
  const Mark = ({ children }: { children: React.ReactNode }) => (
    <mark className="rounded-md bg-[rgba(156,188,255,0.14)] px-1 text-[var(--light)] shadow-[inset_0_0_0_1px_rgba(156,188,255,0.3)]">
      {children}
    </mark>
  );
  return (
    <figure className="relative">
      <div className="glass glass-strong absolute -right-3 -top-7 z-10 hidden w-[230px] rotate-[3deg] p-4 text-[0.8rem] text-[var(--text-dim)] sm:block" aria-hidden="true">
        <p className="text-[var(--silver)]">Observations utilisées</p>
        <p className="mt-1">activité · site actuel · besoin détecté</p>
      </div>
      <div className="glass p-5 sm:p-7" data-glow>
        <p className="text-[0.8rem] text-[var(--text-dim)]">Brouillon préparé par l&apos;agent</p>
        <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-[var(--text)]">
          <p>Bonjour,</p>
          <p>
            En découvrant <Mark>votre atelier de menuiserie</Mark>, j&apos;ai remarqué que <Mark>votre site
            s&apos;affiche mal sur téléphone</Mark>, alors que c&apos;est souvent là que vos clients vous cherchent.
          </p>
          <p>
            Je vous propose un court échange pour voir comment <Mark>faciliter les demandes de devis</Mark> en ligne.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="tag"><span className="tag-dot" />Personnalisé</span>
          <span className="tag">À relire avant envoi</span>
        </div>
        <Note />
      </div>
    </figure>
  );
}

function TrackingVisual() {
  const cols = [
    { name: "À contacter", items: ["Entreprise A", "Entreprise B"] },
    { name: "Contacté", items: ["Entreprise C"] },
    { name: "En échange", items: ["Entreprise D"] },
  ];
  return (
    <figure className="glass p-5 sm:p-7" data-glow>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((c) => (
          <div key={c.name} className="min-w-0">
            <p className="truncate text-[0.78rem] text-[var(--text-dim)]">{c.name}</p>
            <div className="mt-3 space-y-2">
              {c.items.map((it) => (
                <div key={it} className="rounded-xl bg-white/[0.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <p className="truncate text-[0.82rem] text-[var(--text)]">{it}</p>
                  <div className="mt-2 h-1 w-2/3 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[rgba(121,210,214,0.07)] px-4 py-3 text-[0.85rem] shadow-[inset_0_0_0_1px_rgba(121,210,214,0.2)]">
        <span className="text-[var(--text)]">Prochaine action : relance</span>
        <span className="text-[var(--tide)]">à planifier</span>
      </div>
      <Note />
    </figure>
  );
}

const steps = [
  {
    n: "01",
    title: "Recherche intelligente",
    text: "L'agent recherche des entreprises sur Internet en fonction de vos critères de prospection et des zones géographiques visées. Il collecte les informations accessibles publiquement et conserve les sources qui étayent chacune de ses observations.",
    visual: <SearchVisual />,
  },
  {
    n: "02",
    title: "Analyse et qualification",
    text: "L'IA analyse les informations disponibles pour identifier les opportunités. Elle distingue deux types de besoins : la création ou la refonte d'un site web, et le besoin potentiel d'un agent IA ou d'une automatisation. Chaque opportunité reçoit un score distinct, accompagné d'une justification lisible.",
    visual: <ScoreVisual />,
  },
  {
    n: "03",
    title: "Personnalisation commerciale",
    text: "À partir de l'activité de l'entreprise et des besoins observés, l'IA prépare des messages personnalisés. Les informations collectées servent à écrire quelque chose de pertinent pour l'entreprise, plutôt qu'un message générique.",
    visual: <MessageVisual />,
  },
  {
    n: "04",
    title: "Suivi intelligent",
    text: "Prospecto est conçu pour centraliser le suivi des prospects : leur statut, les actions à effectuer et l'historique des échanges commerciaux. L'objectif est simple : savoir à tout moment où en est chaque opportunité.",
    visual: <TrackingVisual />,
  },
];

export default function Steps() {
  return (
    <section id="fonctionnement" className="section" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="max-w-3xl">
          <h2 id="steps-title" className="h2" data-reveal>Comment fonctionne Prospecto</h2>
          <p className="lede mt-7" data-reveal="0.1">
            Quatre étapes, de la recherche d&apos;entreprises au suivi des prospects. L&apos;agent prend en charge
            le travail répétitif ; vous gardez la main sur la relation.
          </p>
        </div>

        <div className="relative mt-20">
          <div
            className="absolute bottom-0 left-[11px] top-0 hidden w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block"
            aria-hidden="true"
          />
        <ol className="relative space-y-24 sm:space-y-32">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="relative grid items-center gap-10 md:grid-cols-2 md:gap-16 md:pl-14"
            >
              <span
                className="absolute left-[6px] top-3 hidden h-[11px] w-[11px] rounded-full bg-[var(--light)] shadow-[0_0_0_5px_rgba(156,188,255,0.12),0_0_20px_rgba(156,188,255,0.7)] md:block"
                aria-hidden="true"
              />
              <div data-reveal className={i % 2 ? "md:order-2" : undefined}>
                <p className="display text-[clamp(3.5rem,8vw,6.5rem)] text-transparent [-webkit-text-stroke:1px_rgba(199,208,221,0.45)]" aria-hidden="true">
                  {s.n}
                </p>
                <h3 className="h3 mt-4">
                  <span className="sr-only">Étape {s.n} : </span>
                  {s.title}
                </h3>
                <p className="mt-4 max-w-[52ch] text-[var(--text-dim)]">{s.text}</p>
              </div>
              <div data-reveal="0.1">{s.visual}</div>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
