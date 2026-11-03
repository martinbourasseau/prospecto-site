export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <h1 className="h2">Cette page n&apos;existe pas.</h1>
      <p className="lede mt-6">L&apos;adresse a peut-être changé. Revenez à l&apos;accueil pour découvrir Prospecto.</p>
      <a href="/" className="btn btn-primary mt-10">Retour à l&apos;accueil</a>
    </section>
  );
}
