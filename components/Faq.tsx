const faq = [
  {
    q: "Qu'est-ce qu'un agent IA de prospection commerciale ?",
    a: "C'est un logiciel qui utilise l'intelligence artificielle pour rechercher des entreprises correspondant à vos critères, analyser les informations disponibles, qualifier les opportunités et préparer des prises de contact. Prospecto automatise ainsi une grande partie de la recherche de prospects, tout en vous laissant la relation commerciale.",
  },
  {
    q: "Prospecto envoie-t-il des emails en masse ?",
    a: "Non. Prospecto n'est pas un outil d'envoi massif. Il prépare des messages personnalisés à partir de ce qu'il a observé sur chaque entreprise, pour des prises de contact pertinentes et ciblées.",
  },
  {
    q: "Comment l'IA qualifie-t-elle un prospect ?",
    a: "L'agent distingue deux types de besoins, la création ou refonte de site web et le besoin d'un agent IA ou d'une automatisation, et attribue à chacun un score distinct, accompagné d'une justification fondée sur les informations collectées.",
  },
  {
    q: "Pouvez-vous créer un agent IA sur mesure pour mon entreprise ?",
    a: "Oui. Nous développons des agents IA et des automatisations adaptés à vos processus : traitement de demandes, automatisation commerciale, connexion entre vos outils, assistants intelligents. Le projet commence toujours par un échange sur vos besoins.",
  },
  {
    q: "Réalisez-vous aussi la création ou la refonte de sites web ?",
    a: "Oui : sites vitrines, sites sur mesure, landing pages, e-commerce et refonte de sites existants, avec une attention particulière à la performance et au référencement naturel.",
  },
];

export default function Faq() {
  return (
    <section id="questions" className="section-tight" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 id="faq-title" className="h2 !text-[clamp(2rem,4vw,3.2rem)]" data-reveal>Questions fréquentes</h2>
        <div>
          {faq.map((f) => (
            <details key={f.q} className="group border-t border-[var(--line)] last:border-b" data-reveal>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[1.08rem] text-[var(--light)] [&::-webkit-details-marker]:hidden">
                <h3 className="font-normal" style={{ fontVariationSettings: '"wdth" 106' }}>{f.q}</h3>
                <span className="relative mt-1.5 h-4 w-4 flex-none" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-[var(--silver)]" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-[var(--silver)] transition-transform duration-500 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[68ch] pb-7 text-[var(--text-dim)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
