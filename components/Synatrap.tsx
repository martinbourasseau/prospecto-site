import { site } from "@/lib/site";
import { Arrow } from "./Icons";

const workshop = ["Identité", "Spécialisation", "Instructions", "Modules", "Mémoire"];

export default function Synatrap() {
  return (
    <section id="synatrap" className="section-tight" aria-labelledby="synatrap-title">
      <div className="wrap">
        <div className="synatrap px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p className="mb-6 text-[0.85rem] text-[#3a465a]" data-reveal>
                Une autre marque de notre écosystème
              </p>
              <h2 id="synatrap-title" className="h2 !text-[clamp(2.2rem,4.4vw,3.9rem)]" data-reveal>
                Un besoin spécifique&nbsp;?
                <br />
                Créez votre propre agent IA.
              </h2>
              <p className="lede mt-8" data-reveal="0.1">
                Avec SYNATRAP, transformez vos idées et vos besoins professionnels en agents IA conçus pour
                automatiser vos tâches et accompagner votre activité.
              </p>
              <p className="lede mt-4" data-reveal="0.15">
                SYNATRAP réunit un catalogue d&apos;agents IA spécialisés, à installer sur votre ordinateur, et un
                atelier pour composer le vôtre sans écrire de code, à partir de la mission que vous lui confiez.
              </p>
              <div className="mt-10" data-reveal="0.2">
                <a href={site.synatrap.url} className="btn btn-dark">
                  Découvrir SYNATRAP
                  <Arrow />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4" data-reveal="0.1">
              <div className="frost p-6">
                <p className="text-[0.85rem] text-[#3a465a]">Deux solutions complémentaires</p>
                <dl className="mt-4 divide-y divide-[rgba(11,18,32,0.1)]">
                  <div className="py-4">
                    <dt className="text-[1.15rem] text-[#070b14]" style={{ fontVariationSettings: '"wdth" 112' }}>Prospecto</dt>
                    <dd className="mt-1 text-[0.95rem] text-[#3a465a]">
                      Un agent IA spécialisé dans la prospection commerciale.
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="text-[1.15rem] text-[#070b14]" style={{ fontVariationSettings: '"wdth" 112' }}>SYNATRAP</dt>
                    <dd className="mt-1 text-[0.95rem] text-[#3a465a]">
                      Une solution dédiée à la création d&apos;agents IA personnalisés, pour des besoins variés.
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="frost p-6">
                <p className="text-[0.85rem] text-[#3a465a]">L&apos;atelier de création, en cinq étapes</p>
                <ol className="mt-4 flex flex-wrap gap-2">
                  {workshop.map((w, i) => (
                    <li key={w} className="rounded-full bg-white/70 px-3.5 py-1.5 text-[0.88rem] text-[#0b1220] shadow-[inset_0_0_0_1px_rgba(11,18,32,0.1)]">
                      <span className="text-[#5f7499]">{i + 1}.</span> {w}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
