import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prospecto — Agent IA de prospection commerciale",
    short_name: "Prospecto",
    start_url: "/",
    display: "standalone",
    background_color: "#03050a",
    theme_color: "#03050a",
    lang: "fr-FR",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
