'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { Persona } from '@getpersona/shared';
import { archivePersona, getPersona, patchPersona } from '@/lib/personas-api';

export function PersonaDetailEditor({ id }: { id: string }) {
  const t = useTranslations('personas');
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    getPersona(id)
      .then(setPersona)
      .catch((e: Error) => setError(e.message || t('errorGeneric')));
  }, [id, t]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!persona) return;
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
      const updated = await patchPersona(id, {
        displayName: String(fd.get('displayName') ?? ''),
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
        isPublic,
      });
      setPersona(updated);
      setPending(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
      setPending(false);
    }
  }

  async function onArchive() {
    if (!confirm(t('archiveConfirm'))) return;
    setPending(true);
    try {
      await archivePersona(id);
      router.push('/personas');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
      setPending(false);
    }
  }

  if (error && !persona) {
    return (
      <p className="error-text" role="alert">
        {error}
      </p>
    );
  }
  if (!persona) {
    return <p className="support">…</p>;
  }

  return (
    <form className="persona-form" onSubmit={onSubmit}>
      {error ? (
        <p className="error-text" role="alert">
          {error}
        </p>
      ) : null}
      <p className="eyebrow">
        {persona.id}
        {persona.archivedAt ? ` · ${t('archived')}` : ''}
      </p>
      <div className="field">
        <label htmlFor="displayName">{t('displayName')}</label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          defaultValue={persona.displayName}
        />
      </div>
      <div className="field">
        <label htmlFor="who">{t('who')}</label>
        <input id="who" name="who" type="text" required defaultValue={persona.identity.who} />
      </div>
      <div className="field">
        <label htmlFor="intent">{t('intent')}</label>
        <input
          id="intent"
          name="intent"
          type="text"
          required
          defaultValue={persona.identity.intent}
        />
      </div>
      <div className="field">
        <label htmlFor="language">{t('language')}</label>
        <input
          id="language"
          name="language"
          type="text"
          required
          defaultValue={persona.identity.language}
        />
      </div>
      <div className="field">
        <label htmlFor="typing">{t('typing')}</label>
        <input id="typing" name="typing" type="text" required defaultValue={persona.voice.typing} />
      </div>
      <div className="field">
        <label htmlFor="stance">{t('stance')}</label>
        <input id="stance" name="stance" type="text" required defaultValue={persona.voice.stance} />
      </div>
      <div className="field">
        <label htmlFor="samples">{t('samples')}</label>
        <textarea
          id="samples"
          name="samples"
          rows={3}
          defaultValue={persona.voice.sampleSentences.join('\n')}
        />
      </div>
      <div className="field">
        <label htmlFor="doNotSay">{t('doNotSay')}</label>
        <textarea
          id="doNotSay"
          name="doNotSay"
          rows={2}
          defaultValue={persona.boundaries.doNotSay.join('\n')}
        />
      </div>
      <div className="checkbox-row">
        <input id="isPublic" name="isPublic" type="checkbox" defaultChecked={persona.isPublic} />
        <label htmlFor="isPublic">{t('makePublic')}</label>
      </div>
      <div className="cta-row">
        <button className="btn btn-accent" type="submit" disabled={pending}>
          {t('save')}
        </button>
        {!persona.archivedAt ? (
          <button className="btn btn-ghost" type="button" disabled={pending} onClick={onArchive}>
            {t('archive')}
          </button>
        ) : null}
      </div>
    </form>
  );
}
