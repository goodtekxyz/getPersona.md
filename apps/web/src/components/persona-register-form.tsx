'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createPersona } from '@/lib/personas-api';

export function PersonaRegisterForm() {
  const t = useTranslations('personas');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const samples = String(fd.get('samples') ?? '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    const doNotSay = String(fd.get('doNotSay') ?? '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const isPublic = fd.get('isPublic') === 'on';

    try {
      const persona = await createPersona({
        displayName: String(fd.get('displayName') ?? ''),
        slug: String(fd.get('slug') ?? '') || undefined,
        identity: {
          who: String(fd.get('who') ?? ''),
          intent: String(fd.get('intent') ?? ''),
          language: String(fd.get('language') ?? 'en'),
        },
        voice: {
          typing: String(fd.get('typing') ?? ''),
          stance: String(fd.get('stance') ?? ''),
          sampleSentences: samples,
        },
        boundaries: { doNotSay },
        permissions: {
          visibility: isPublic ? 'public' : 'private',
          automation: 'none',
        },
        isPublic,
      });
      router.push(`/personas/${persona.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
      setPending(false);
    }
  }

  return (
    <form className="persona-form" onSubmit={onSubmit}>
      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}
      <div className="field">
        <label htmlFor="displayName">{t('displayName')}</label>
        <input id="displayName" name="displayName" type="text" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="slug">{t('slug')}</label>
        <input id="slug" name="slug" type="text" maxLength={64} placeholder="optional" />
      </div>
      <div className="field">
        <label htmlFor="who">{t('who')}</label>
        <input id="who" name="who" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="intent">{t('intent')}</label>
        <input id="intent" name="intent" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="language">{t('language')}</label>
        <input id="language" name="language" type="text" defaultValue="en" required />
      </div>
      <div className="field">
        <label htmlFor="typing">{t('typing')}</label>
        <input id="typing" name="typing" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="stance">{t('stance')}</label>
        <input id="stance" name="stance" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="samples">{t('samples')}</label>
        <textarea id="samples" name="samples" rows={3} placeholder={t('samplesHint')} />
      </div>
      <div className="field">
        <label htmlFor="doNotSay">{t('doNotSay')}</label>
        <textarea id="doNotSay" name="doNotSay" rows={2} />
      </div>
      <div className="checkbox-row">
        <input id="isPublic" name="isPublic" type="checkbox" />
        <label htmlFor="isPublic">{t('makePublic')}</label>
      </div>
      <button className="btn btn-accent" type="submit" disabled={pending}>
        {t('register')}
      </button>
    </form>
  );
}
