import { site } from "@/lib/site";
import PMark from "./PMark";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pb-10 pt-16">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="/#accueil" className="flex min-h-[44px] items-center gap-3" aria-label="Prospecto, retour à l'accueil">
              <PMark className="h-9 w-auto" />
              <span className="wordmark text-[0.85rem] text-[var(--light)]">Prospecto</span>
            </a>
            <p className="mt-5 max-w-[36ch] text-[0.92rem] text-[var(--text-dim)]">
              Agent IA de prospection commerciale, création de sites web et d&apos;agents IA sur mesure.
            </p>
          </div>
          <nav aria-label="Plan du site">
            <p className="text-[0.85rem] text-[var(--silver)]">Le site</p>
            <ul className="mt-2 text-[0.92rem] text-[var(--text-dim)]">
              <li><a className="foot-link" href="/#prospecto">Prospecto</a></li>
              <li><a className="foot-link" href="/#fonctionnement">Fonctionnement</a></li>
              <li><a className="foot-link" href="/#capacites">Capacités</a></li>
              <li><a className="foot-link" href="/#solutions">Solutions IA</a></li>
              <li><a className="foot-link" href="/#a-propos">À propos</a></li>
            </ul>
          </nav>
          <div>
            <p className="text-[0.85rem] text-[var(--silver)]">Contact</p>
            <ul className="mt-2 text-[0.92rem] text-[var(--text-dim)]">
              <li><a className="foot-link break-all" href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a className="foot-link" href={site.synatrap.url}>SYNATRAP</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[0.85rem] text-[var(--silver)]">Informations</p>
            <ul className="mt-2 text-[0.92rem] text-[var(--text-dim)]">
              <li><a className="foot-link" href="/mentions-legales">Mentions légales</a></li>
              <li><a className="foot-link" href="/confidentialite">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-14 text-[0.8rem] text-[var(--text-dim)]">© {new Date().getFullYear()} Prospecto. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
