import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { site } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/breadcrumb";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment prospecto.website traite vos données : aucun cookie de suivi, contact par email uniquement.",
  alternates: { canonical: "/confidentialite" },
};

const Todo = ({ children }: { children: React.ReactNode }) => <span className="todo">À compléter : {children}</span>;

export default function Page() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="3 novembre 2026">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("Politique de confidentialité", "/confidentialite")) }} />

      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement est <Todo>nom de l&apos;éditeur</Todo>, joignable à l&apos;adresse{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Données collectées</h2>
      <p>
        Le site ne comporte ni formulaire, ni création de compte, ni outil de mesure d&apos;audience, ni publicité.
        Les seules données personnelles traitées sont celles que vous choisissez de nous transmettre par email
        (nom, adresse email, contenu de votre message).
      </p>
      <ul>
        <li>Finalité : répondre à votre demande et, le cas échéant, préparer une proposition commerciale.</li>
        <li>Base légale : mesures précontractuelles prises à votre demande et intérêt légitime à répondre aux sollicitations.</li>
        <li>Durée de conservation : <Todo>durée retenue, par exemple 3 ans après le dernier échange</Todo>.</li>
        <li>Destinataires : le responsable du traitement uniquement ; aucune donnée n&apos;est vendue ni cédée.</li>
      </ul>

      <h2>Hébergement et journaux techniques</h2>
      <p>
        Comme tout hébergeur, Vercel Inc. traite des données techniques (adresse IP, type de navigateur, pages
        demandées) dans des journaux nécessaires au fonctionnement et à la sécurité du service. Ces traitements
        peuvent impliquer un transfert de données hors de l&apos;Union européenne, encadré par les garanties prévues
        par l&apos;hébergeur.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise aucun cookie publicitaire ni de mesure d&apos;audience, et ne dépose aucun cookie non
        essentiel. Aucun bandeau de consentement n&apos;est donc nécessaire. Les polices de caractères sont servies
        depuis le site lui-même, sans appel à un service tiers.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de
        rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité de vos données. Pour les
        exercer, écrivez à <a href={`mailto:${site.email}`}>{site.email}</a>. Vous pouvez également introduire une
        réclamation auprès de la CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).
      </p>
    </LegalLayout>
  );
}
