export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="wrap pb-28 pt-40">
      <nav aria-label="Fil d'Ariane" className="text-[0.85rem] text-[var(--text-dim)]">
        <ol className="flex gap-2">
          <li><a className="hover:text-[var(--light)]" href="/">Accueil</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--silver)]">{title}</li>
        </ol>
      </nav>
      <h1 className="h2 mt-8">{title}</h1>
      <p className="mt-4 text-[0.9rem] text-[var(--text-dim)]">Dernière mise à jour : {updated}</p>
      <div className="prose-legal mt-10">{children}</div>
    </article>
  );
}
