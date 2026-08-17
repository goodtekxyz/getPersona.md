import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RequireAuth } from '@/components/require-auth';
import { PersonaDetailEditor } from '@/components/persona-detail-editor';

export default async function PersonaDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('personas');

  return (
    <RequireAuth>
      <p className="eyebrow">
        <Link href="/personas">{t('back')}</Link>
      </p>
      <h1 className="display-md" style={{ marginBottom: 24 }}>
        {t('detailTitle')}
      </h1>
      <PersonaDetailEditor id={id} />
    </RequireAuth>
  );
}
