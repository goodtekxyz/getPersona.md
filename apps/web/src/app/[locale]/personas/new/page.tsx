import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RequireAuth } from '@/components/require-auth';
import { PersonaRegisterForm } from '@/components/persona-register-form';

export default async function NewPersonaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('personas');

  return (
    <RequireAuth>
      <p className="eyebrow">
        <Link href="/personas">{t('back')}</Link>
      </p>
      <h1 className="display-md" style={{ marginBottom: 24 }}>
        {t('registerTitle')}
      </h1>
      <PersonaRegisterForm />
    </RequireAuth>
  );
}
