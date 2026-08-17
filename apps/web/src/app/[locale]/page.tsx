import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('landing');
  const brand = await getTranslations();

  return (
    <div>
      <p className="eyebrow">{t('eyebrow')}</p>
      <h1 className="display-hero">{brand('brand')}</h1>
      <p className="support">{t('headline')}</p>
      <p className="support" style={{ marginTop: 8 }}>
        {t('support')}
      </p>
      <div className="cta-row">
        <Link href="/sign-up" className="btn btn-accent">
          {t('ctaSignUp')}
        </Link>
        <Link href="/sign-in" className="btn btn-ghost">
          {t('ctaSignIn')}
        </Link>
      </div>
      <div className="hero-plane" aria-hidden="true" />
    </div>
  );
}
