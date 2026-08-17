'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Persona } from '@getpersona/shared';
import { listPersonas } from '@/lib/personas-api';

export function PersonaList() {
  const t = useTranslations('personas');
  const [items, setItems] = useState<Persona[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPersonas()
      .then((r) => setItems(r.items))
      .catch((e: Error) => setError(e.message || t('errorGeneric')));
  }, [t]);

  if (error) {
    return (
      <p className="error-text" role="alert">
        {error}
      </p>
    );
  }
  if (!items) {
    return <p className="support">…</p>;
  }
  if (items.length === 0) {
    return (
      <div>
        <p className="support">{t('empty')}</p>
        <div className="cta-row">
          <Link href="/personas/new" className="btn btn-accent">
            {t('register')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="persona-list">
      {items.map((p) => (
        <li key={p.id} className="persona-row">
          <Link href={`/personas/${p.id}`}>
            <span className="persona-name">{p.displayName}</span>
            <span className="persona-meta">
              {p.slug}
              {p.isPublic ? ` · ${t('public')}` : ''}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
