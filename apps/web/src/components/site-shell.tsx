'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === 'ko' ? 'en' : 'ko';

  return (
    <div className="shell">
      <header className="topnav">
        <Link href="/" className="brand">
          {t('brand')}
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/sign-in" data-active={pathname.includes('sign-in') ? 'true' : 'false'}>
            {t('nav.signIn')}
          </Link>
          <Link href="/sign-up" data-active={pathname.includes('sign-up') ? 'true' : 'false'}>
            {t('nav.signUp')}
          </Link>
          <Link href={pathname || '/'} locale={other}>
            {other.toUpperCase()}
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <span>{t('footer.product')}</span>
        <Link href="/terms">{t('auth.termsLink')}</Link>
        <Link href="/privacy">{t('auth.privacyLink')}</Link>
      </footer>
    </div>
  );
}
