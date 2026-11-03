import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Interactions from "@/components/Interactions";

// Archivo (SIL Open Font License), variable en graisse et en chasse, servie depuis le site.
const archivo = localFont({
  src: [{ path: "./fonts/archivo-latin-var.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Prospecto — Agent IA de prospection commerciale",
    template: "%s — Prospecto",
  },
  description: site.description,
  applicationName: "Prospecto",
  keywords: [
    "agent IA prospection commerciale",
    "prospection commerciale automatisée",
    "recherche de prospects par IA",
    "automatisation commerciale",
    "création d'agents IA",
    "développement d'agents IA sur mesure",
    "création de site web professionnel",
    "refonte de site web",
    "automatisation des tâches professionnelles",
  ],
  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/" },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: "Prospecto",
    title: "Prospecto — Agent IA de prospection commerciale",
    description:
      "Un agent IA qui recherche des entreprises, qualifie les opportunités et prépare des prises de contact personnalisées.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prospecto — Agent IA de prospection commerciale",
    description:
      "Un agent IA qui recherche des entreprises, qualifie les opportunités et prépare des prises de contact personnalisées.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  // Search Console : ajoutez ici le jeton de vérification une fois obtenu.
  // verification: { google: "VOTRE_JETON" },
};

export const viewport: Viewport = {
  themeColor: "#03050a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: "Prospecto",
      url: site.url,
      logo: `${site.url}/icon.svg`,
      email: site.email,
      description:
        "Prospecto conçoit un agent IA de prospection commerciale et réalise des sites web et des agents IA sur mesure pour les entreprises.",
      knowsAbout: [
        "Prospection commerciale",
        "Intelligence artificielle",
        "Agents IA",
        "Automatisation des processus",
        "Création de sites web",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "commercial",
        email: site.email,
        availableLanguage: ["French"],
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Solutions numériques et intelligence artificielle",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Création de sites web professionnels et refonte de sites existants" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Développement d'agents IA sur mesure" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Automatisation des tâches et des processus commerciaux" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: "Prospecto",
      inLanguage: "fr-FR",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-FR" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Active les apparitions au défilement uniquement si JS est disponible et le mouvement autorisé. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <Nav />
        <main id="contenu">{children}</main>
        <Footer />
        <Interactions />
      </body>
    </html>
  );
}
