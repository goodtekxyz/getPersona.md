import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RequireAuth } from '@/components/require-auth';
import { PersonaList } from '@/components/persona-list';

export default async function PersonasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('personas');

  return (
    <RequireAuth>
      <div className="app-header-row">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="display-md">{t('listTitle')}</h1>
        </div>
        <Link href="/personas/new" className="btn btn-accent">
          {t('register')}
        </Link>
      </div>
      <PersonaList />
    </RequireAuth>
  );
}
