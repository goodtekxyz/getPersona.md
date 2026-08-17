import { setRequestLocale } from 'next-intl/server';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <article className="auth-column">
      <h1 className="display-md">Terms</h1>
      <p className="support">Placeholder terms for M1 signup consent (getDesign.md parity).</p>
    </article>
  );
}
