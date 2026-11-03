const points = [
  { t: "Des solutions personnalisées", d: "Chaque site et chaque agent est construit pour votre activité, pas adapté d'un modèle générique." },
  { t: "Une approche orientée résultats", d: "Nous partons de l'objectif : plus de demandes, moins de tâches manuelles, un suivi plus clair." },
  { t: "Une automatisation intelligente", d: "Automatiser ce qui doit l'être, garder l'humain là où il apporte de la valeur." },
  { t: "Des technologies modernes", d: "Next.js, intelligence artificielle, API et workflows : des outils récents, choisis pour durer." },
  { t: "Un accompagnement de bout en bout", d: "De la conception à la mise en production, avec un interlocuteur unique." },
  { t: "Des besoins réels avant tout", d: "Pas de fonctionnalité superflue : une solution adaptée à votre fonctionnement et à vos moyens." },
];

export default function WhyUs() {
  return (
    <section id="a-propos" className="section" aria-labelledby="why-title">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <h2 id="why-title" className="h2" data-reveal>Pourquoi travailler avec nous&nbsp;?</h2>
            <p className="lede mt-8" data-reveal="0.1">
              Derrière Prospecto, il y a un développeur spécialisé dans les solutions numériques et
              l&apos;intelligence artificielle, qui conçoit des sites web, des agents IA et des automatisations
              pour les entreprises, les entrepreneurs et les professionnels.
            </p>
          </div>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {points.map((p, i) => (
              <div key={p.t} className="border-t border-[var(--line)] py-7" data-reveal={String((i % 2) * 0.08)}>
                <dt className="h3 !text-[1.25rem]">{p.t}</dt>
                <dd className="mt-3 text-[var(--text-dim)]">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
