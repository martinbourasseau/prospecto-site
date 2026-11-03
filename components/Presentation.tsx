const pairs = [
  {
    before: "Des heures de recherche manuelle pour constituer une liste d'entreprises.",
    after: "Une recherche menée par l'agent, selon vos critères et vos zones géographiques.",
  },
  {
    before: "Des entreprises difficiles à départager : lesquelles ont vraiment un besoin ?",
    after: "Des opportunités repérées à partir de ce que chaque entreprise montre en ligne.",
  },
  {
    before: "Une qualification au ressenti, sans trace de ce qui a motivé le choix.",
    after: "Un score par type de besoin, toujours accompagné de sa justification.",
  },
  {
    before: "Des messages génériques, reconnus et ignorés dès la première ligne.",
    after: "Des messages préparés à partir des informations observées sur l'entreprise.",
  },
  {
    before: "Un suivi éparpillé entre tableurs, notes et boîte mail.",
    after: "Un suivi pensé pour être centralisé : statuts, prochaines actions, échanges.",
  },
];

export default function Presentation() {
  return (
    <section id="prospecto" className="section overflow-hidden" aria-labelledby="prospecto-title">
      <div className="aura -left-[20vw] top-[10%]" />
      <div className="wrap relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="kicker mb-5" data-reveal>Agent IA de prospection commerciale</p>
            <h2 id="prospecto-title" className="h2" data-reveal>
              La prospection intelligente, réinventée.
            </h2>
            <p className="lede mt-8" data-reveal="0.1">
              Trouver de nouveaux clients reste l&apos;une des tâches les plus chronophages d&apos;une entreprise.
              Chercher des sociétés, vérifier leur présence en ligne, deviner leurs besoins, écrire, relancer :
              la prospection commerciale traditionnelle consomme un temps qui manque ailleurs.
            </p>
            <p className="lede mt-5" data-reveal="0.15">
              Prospecto transforme ce travail en un processus structuré et assisté par l&apos;intelligence
              artificielle. Ce n&apos;est pas un outil d&apos;envoi massif d&apos;emails : c&apos;est un agent qui
              recherche, analyse, qualifie et prépare, pour que votre énergie aille à la relation commerciale.
            </p>
          </div>

          <div>
            <div className="mb-4 hidden grid-cols-2 gap-6 px-1 text-[0.85rem] text-[var(--text-dim)] sm:grid" aria-hidden="true">
              <span>Prospection traditionnelle</span>
              <span className="text-[var(--glacier)]">Avec Prospecto</span>
            </div>
            <ul className="flex flex-col">
              {pairs.map((p, i) => (
                <li
                  key={i}
                  className="group relative grid gap-3 border-t border-[var(--line)] py-7 sm:grid-cols-2 sm:gap-6"
                  data-reveal={String(i * 0.05)}
                >
                  <p className="text-[var(--text-dim)] line-through decoration-white/15 decoration-1">
                    <span className="sr-only">Prospection traditionnelle : </span>
                    {p.before}
                  </p>
                  <p className="relative text-[var(--light)]">
                    <span className="sr-only">Avec Prospecto : </span>
                    <span
                      className="absolute -left-4 top-[0.55em] hidden h-1.5 w-1.5 rounded-full bg-[var(--glacier)] shadow-[0_0_12px_var(--glacier)] sm:block"
                      aria-hidden="true"
                    />
                    {p.after}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
