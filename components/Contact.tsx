"use client";

import { useState } from "react";
import { mailto, site } from "@/lib/site";
import { Copy, Mail } from "./Icons";
import PMark from "./PMark";

const projectBody = `Bonjour,

Je souhaite échanger sur un projet :
- [ ] Création ou refonte de site web
- [ ] Agent IA sur mesure
- [ ] Automatisation de tâches
- [ ] Prospecto

Mon entreprise :
Mon besoin :
Mes disponibilités pour un échange :

Merci,`;

export default function Contact() {
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied("ok");
    } catch {
      setCopied("error");
    }
    window.setTimeout(() => setCopied("idle"), 2600);
  };

  return (
    <section id="contact" className="section relative overflow-hidden" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center opacity-[0.07]" aria-hidden="true">
        <PMark className="h-[120vh] max-h-[1100px] w-auto blur-[1px]" />
      </div>
      <div className="aura left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, rgba(156,188,255,0.3), transparent 62%)" }} />

      <div className="wrap relative">
        <div className="mx-auto max-w-5xl text-center">
          <h2 id="contact-title" className="h2 !text-[clamp(2.5rem,6.4vw,5.8rem)]" data-reveal>
            Et si nous faisions évoluer votre activité&nbsp;?
          </h2>
          <p className="lede mx-auto mt-8" data-reveal="0.1">
            Vous avez un projet de site web, une idée d&apos;agent IA ou souhaitez automatiser certaines tâches de
            votre entreprise&nbsp;? Échangeons sur vos besoins et imaginons une solution adaptée.
          </p>
        </div>

        <div className="glass glass-strong mx-auto mt-14 max-w-4xl rounded-[var(--radius-xl)] p-6 text-center sm:p-12" data-reveal="0.15" data-glow>
          <p className="text-[0.9rem] text-[var(--text-dim)]">Écrivez-nous directement</p>
          <a href={mailto()} className="contact-email mt-3 inline-block">
            {site.email}
          </a>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a href={mailto()} className="btn btn-primary" data-glow>
              <Mail />
              Envoyer un email
            </a>
            <a href={mailto(site.emailSubject, projectBody)} className="btn btn-glass glass" data-glow>
              Discuter de mon projet
            </a>
            <button type="button" onClick={copy} className="btn btn-glass glass" data-glow>
              <Copy />
              {copied === "ok" ? "Adresse copiée" : copied === "error" ? "Copie impossible" : "Copier l'adresse"}
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {copied === "ok" ? "Adresse email copiée dans le presse-papiers." : copied === "error" ? "La copie a échoué, sélectionnez l'adresse manuellement." : ""}
          </p>
          <p className="mt-7 text-[0.82rem] text-[var(--text-dim)]">
            Les boutons ouvrent votre messagerie avec l&apos;objet « {site.emailSubject} ».
          </p>
        </div>
      </div>
    </section>
  );
}
