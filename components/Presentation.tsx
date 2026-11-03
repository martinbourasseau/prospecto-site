const pairs = [
  ["Recherche manuelle", "Recherche par IA"],
  ["Entreprises au hasard", "Ciblage par critères et par zone"],
  ["Qualification au ressenti", "Score justifié par type de besoin"],
  ["Messages génériques", "Messages personnalisés"],
  ["Suivi éparpillé", "Suivi centralisé"],
];

export default function Presentation() {
  return (
    <section id="prospecto" className="section overflow-hidden" aria-labelledby="prospecto-title">
      <div className="aura -left-[20vw] top-[10%]" data-parallax="-50" />
      <div className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="kicker mb-5" data-reveal>Agent IA de prospection commerciale</p>
            <h2 id="prospecto-title" className="h2" data-reveal>
              La prospection intelligente, réinventée.
            </h2>
            <p className="lede mt-8" data-reveal="0.1">
              Moins de recherche manuelle. <span className="text-[var(--light)]">Plus de temps pour vendre.</span>
            </p>
            <p className="mt-5 max-w-[46ch] text-[var(--text-dim)]" data-reveal="0.15">
              Pas un outil d&apos;envoi massif : un agent qui <strong className="kw">recherche</strong>,{" "}
              <strong className="kw">analyse</strong>, <strong className="kw">qualifie</strong> et{" "}
              <strong className="kw">prépare</strong> votre prospection commerciale automatisée.
            </p>
          </div>

          <ul className="flex flex-col" aria-label="Prospection traditionnelle comparée à Prospecto">
            {pairs.map(([before, after], i) => (
              <li key={before} className="pair" data-reveal={String(i * 0.06)}>
                <span className="pair-before">
                  <span className="sr-only">Avant : </span>
                  {before}
                </span>
                <span className="pair-arrow" aria-hidden="true" />
                <span className="pair-after">
                  <span className="sr-only">Avec Prospecto : </span>
                  {after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
