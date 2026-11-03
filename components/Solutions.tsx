import { Arrow } from "./Icons";

const web = [
  "Sites vitrines professionnels",
  "Sites web sur mesure",
  "Landing pages",
  "Sites e-commerce",
  "Refonte de sites existants",
  "Expériences web premium",
];

const ai = [
  "Agents IA personnalisés",
  "Automatisation de tâches professionnelles",
  "Automatisation de processus commerciaux",
  "Assistants intelligents",
  "Connexion entre vos outils",
  "Automatisations avec API et workflows",
];

function WebVisual() {
  return (
    <div className="relative h-[230px] [perspective:900px] sm:h-[260px]" aria-hidden="true">
      {[2, 1, 0].map((d) => (
        <div
          key={d}
          className="glass absolute inset-x-[6%] top-0 h-[200px] overflow-hidden rounded-[18px] sm:h-[220px]"
          style={{
            transform: `translate3d(${d * 26}px, ${d * 18}px, ${-d * 60}px) rotateY(-14deg) rotateX(6deg)`,
            opacity: 1 - d * 0.28,
          }}
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/12" />
            <span className="ml-3 h-2 w-28 rounded-full bg-white/10" />
          </div>
          {d === 0 && (
            <div className="p-5">
              <div className="h-3 w-1/2 rounded-full bg-white/50" />
              <div className="mt-2.5 h-3 w-1/3 rounded-full bg-white/25" />
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <div className="h-14 rounded-lg bg-gradient-to-br from-[rgba(156,188,255,0.35)] to-transparent" />
                <div className="h-14 rounded-lg bg-white/[0.06]" />
                <div className="h-14 rounded-lg bg-white/[0.06]" />
              </div>
              <div className="mt-4 h-7 w-28 rounded-full bg-white/80" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AgentVisual() {
  const nodes = [
    { x: 60, y: 46, label: "Email" },
    { x: 300, y: 40, label: "CRM" },
    { x: 40, y: 190, label: "Agenda" },
    { x: 320, y: 196, label: "Tableur" },
    { x: 180, y: 226, label: "API" },
  ];
  return (
    <svg viewBox="0 0 360 250" className="h-[230px] w-full sm:h-[260px]" aria-hidden="true">
      <defs>
        <radialGradient id="agentCore">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#c9d8ff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#9cbcff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {nodes.map((n) => (
        <line key={n.label} x1="180" y1="125" x2={n.x} y2={n.y} stroke="rgba(156,188,255,0.55)" strokeWidth="1.2" className="flow-line" />
      ))}
      <circle cx="180" cy="125" r="56" fill="url(#agentCore)" opacity="0.5" />
      <circle cx="180" cy="125" r="26" fill="rgba(12,18,32,0.9)" stroke="rgba(255,255,255,0.5)" />
      <text x="180" y="129.5" textAnchor="middle" fontSize="12" fill="#f1f4f9" style={{ fontVariationSettings: '"wdth" 110' }}>Agent</text>
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x - 34} y={n.y - 15} width="68" height="30" rx="15" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" />
          <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize="12" fill="#c7d0dd">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Panel({
  id, title, intro, items, visual,
}: { id: string; title: string; intro: string; items: string[]; visual: React.ReactNode }) {
  return (
    <article className="glass flex flex-col rounded-[var(--radius-xl)] p-6 sm:p-9" data-reveal data-glow aria-labelledby={id}>
      {visual}
      <h3 id={id} className="h3 mt-6 !text-[clamp(1.6rem,2.6vw,2.2rem)]">{title}</h3>
      <p className="mt-4 text-[var(--text-dim)]">{intro}</p>
      <ul className="mt-6 grid gap-x-6 gap-y-2.5 text-[0.95rem] sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-[var(--text)]">
            <span className="mt-[0.6em] h-px w-3 flex-none bg-[var(--glacier)]" aria-hidden="true" />
            {i}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Solutions() {
  return (
    <section id="solutions" className="section" aria-labelledby="solutions-title">
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="kicker mb-5" data-reveal>Sites web, agents IA, automatisation</p>
          <h2 id="solutions-title" className="h2" data-reveal>Les solutions que nous pouvons créer</h2>
          <p className="lede mt-7" data-reveal="0.1">
            Prospecto montre ce qu&apos;un agent bien conçu peut apporter. Nous créons aussi des solutions sur mesure
            pour les entreprises : chaque projet part de vos besoins, de vos outils existants et de vos objectifs.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Panel
            id="sol-web"
            title="Création de sites web"
            intro="Un site internet professionnel, rapide et bien référencé, qui présente clairement votre activité et transforme les visites en demandes. Création d'un nouveau site ou refonte d'un site web existant."
            items={web}
            visual={<WebVisual />}
          />
          <Panel
            id="sol-ia"
            title="Création d'agents IA"
            intro="Des agents IA développés sur mesure pour automatiser les tâches professionnelles qui vous prennent du temps, et relier les outils que vous utilisez déjà."
            items={ai}
            visual={<AgentVisual />}
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-[var(--line)] pt-10 sm:flex-row sm:items-center" data-reveal>
          <p className="max-w-[56ch] text-[var(--text-dim)]">
            Un projet ne ressemble à aucun autre : nous définissons ensemble le périmètre, les priorités et la
            façon de mesurer le résultat avant d&apos;écrire la première ligne de code.
          </p>
          <a href="#contact" className="btn btn-primary" data-glow>
            Parler de mon projet
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
