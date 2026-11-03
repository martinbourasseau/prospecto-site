export const site = {
  name: "Prospecto",
  url: "https://prospecto.website",
  locale: "fr_FR",
  lang: "fr-FR",
  email: "martin.bourasseau4@gmail.com",
  emailSubject: "Projet de création web ou d'intelligence artificielle",
  synatrap: { name: "SYNATRAP", url: "https://synatrap.com" },
  title: "Prospecto — Agent IA de prospection commerciale",
  description:
    "Prospecto est un agent IA de prospection commerciale : recherche d'entreprises, qualification des prospects, détection d'opportunités et préparation de messages personnalisés. Création de sites web et d'agents IA sur mesure.",
} as const;

export function mailto(subject: string = site.emailSubject, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${site.email}?${params.toString().replace(/\+/g, "%20")}`;
}
