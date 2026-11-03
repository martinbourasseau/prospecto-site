import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site prospecto.website : éditeur, hébergement et propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

const Todo = ({ children }: { children: React.ReactNode }) => <span className="todo">À compléter : {children}</span>;

export default function Page() {
  return (
    <LegalLayout title="Mentions légales" updated="3 novembre 2026">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("Mentions légales", "/mentions-legales")) }} />
      <p>
        Les éléments signalés « À compléter » doivent être renseignés avant la mise en ligne définitive, conformément
        à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>Nom ou raison sociale : <Todo>nom de l&apos;éditeur</Todo></li>
        <li>Statut juridique : <Todo>statut (entrepreneur individuel, société…)</Todo></li>
        <li>Numéro SIREN / SIRET : <Todo>numéro d&apos;immatriculation</Todo></li>
        <li>Adresse : <Todo>adresse postale</Todo></li>
        <li>Email : <a href={`mailto:${site.email}`}>{site.email}</a></li>
        <li>Directeur de la publication : <Todo>nom du responsable de publication</Todo></li>
        <li>Numéro de TVA intracommunautaire, le cas échéant : <Todo>numéro ou mention « non applicable »</Todo></li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —{" "}
        <a href="https://vercel.com" rel="noopener">vercel.com</a>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, identité visuelle, logo Prospecto, éléments graphiques et
        code) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale
        ou partielle, sans autorisation préalable est interdite.
      </p>
      <p>
        Les interfaces présentées sur la page d&apos;accueil sont des illustrations conceptuelles : les entreprises,
        scores et messages qui y figurent sont fictifs.
      </p>

      <h2>Liens externes</h2>
      <p>
        Le site contient un lien vers <a href={site.synatrap.url}>synatrap.com</a>, site d&apos;une marque
        distincte. Le contenu des sites externes relève de la responsabilité de leurs éditeurs.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans la <a href="/confidentialite">politique de
        confidentialité</a>.
      </p>
    </LegalLayout>
  );
}
