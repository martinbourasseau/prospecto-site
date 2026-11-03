const points = [
  { t: "Sur mesure", d: "Construit pour votre activité, pas pour un modèle." },
  { t: "Orienté résultats", d: "Plus de demandes, moins de tâches manuelles." },
  { t: "Automatisation intelligente", d: "La machine répète, l'humain décide." },
  { t: "Technologies modernes", d: "Next.js, IA, API et workflows." },
  { t: "De bout en bout", d: "De la conception à la mise en production." },
  { t: "Besoins réels", d: "Rien de superflu, tout ce qui sert." },
];

export default function WhyUs() {
  return (
    <section id="a-propos" className="section" aria-labelledby="why-title">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <h2 id="why-title" className="h2" data-reveal>Pourquoi travailler avec nous&nbsp;?</h2>
            <p className="lede mt-8" data-reveal="0.1">
              Un développeur spécialisé en <strong className="kw">solutions numériques</strong> et en{" "}
              <strong className="kw">intelligence artificielle pour entreprises</strong>.
            </p>
          </div>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {points.map((p, i) => (
              <div key={p.t} className="why-item border-t border-[var(--line)] py-7" data-reveal={String((i % 2) * 0.08)}>
                <dt className="h3 !text-[clamp(1.3rem,2vw,1.6rem)]">{p.t}</dt>
                <dd className="mt-2 text-[var(--text-dim)]">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
