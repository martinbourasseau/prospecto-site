# prospecto-site

Site officiel de **Prospecto** — https://prospecto.website

Site vitrine statique (Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js). Indépendant de l'agent Python
(`martinbourasseau/-prospection-ia`) : aucune connexion ni dépendance.

## Développement

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
npm run lint    # vérification TypeScript
```

## Structure

- `app/` — pages (accueil, mentions légales, confidentialité), métadonnées SEO, sitemap, robots, images de partage
- `components/` — sections de la page d'accueil, navigation, pied de page
- `lib/heroScene.ts` — scène WebGL du hero (P en verre, eau réfléchissante, particules, lumière)
- `lib/pShape.ts` — géométrie unique du P (logo SVG et objet 3D)
- `lib/site.ts` — constantes du site (URL, email de contact, lien SYNATRAP)

## Hero 3D

- Chargé après l'affichage du texte (import dynamique), en pause hors écran et onglet masqué.
- Qualité adaptative (résolution réduite si l'appareil peine).
- Rendu de secours vectoriel si WebGL est absent ou uniquement logiciel.
- `prefers-reduced-motion` : image fixe, sans animation.
- `?force3d` dans l'URL force la scène 3D (tests).

## À compléter avant publication définitive

- Mentions légales et politique de confidentialité : éléments signalés « À compléter ».
- Search Console : ajouter le jeton dans `app/layout.tsx` (`metadata.verification.google`).

## Version anglaise future

Le site est en `fr-FR`. Pour ajouter l'anglais : déplacer les pages sous `app/[lang]/`, extraire les textes des
composants dans des dictionnaires, et compléter `alternates.languages` (hreflang) dans les métadonnées.
