'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SyncJob, SyncJobStatus } from '@getpersona/shared';
import { enqueueSync, getSyncJob } from '@/lib/sync-api';

const TERMINAL: SyncJobStatus[] = ['done', 'failed'];

export function PersonaSyncPanel({ personaId }: { personaId: string }) {
  const t = useTranslations('sync');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [job, setJob] = useState<SyncJob | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPoll(), [stopPoll]);

  const startPoll = useCallback(
    (jobId: string) => {
      stopPoll();
      pollRef.current = setInterval(() => {
        void getSyncJob(jobId)
          .then((next) => {
            setJob(next);
            if (TERMINAL.includes(next.status)) {
              stopPoll();
              setPending(false);
            }
          })
          .catch((e: Error) => {
            setError(e.message || t('errorGeneric'));
            stopPoll();
            setPending(false);
          });
      }, 800);
    },
    [stopPoll, t],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    stopPoll();
    const fd = new FormData(e.currentTarget);
    const blog = String(fd.get('blog') ?? '').trim();
    const x = String(fd.get('x') ?? '').trim();
    const threads = String(fd.get('threads') ?? '').trim();
    if (!blog && !x && !threads) {
      setError(t('needHandle'));
      setPending(false);
      return;
    }

    try {
      const created = await enqueueSync({
        personaId,
        handles: {
          ...(blog ? { blog } : {}),
          ...(x ? { x } : {}),
          ...(threads ? { threads } : {}),
        },
      });
      setJob(created);
      if (TERMINAL.includes(created.status)) {
        setPending(false);
      } else {
        startPoll(created.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
      setPending(false);
    }
  }

  return (
    <section className="sync-panel" aria-labelledby="sync-heading">
      <h2 id="sync-heading" className="display-md" style={{ marginBottom: 8, fontSize: 22 }}>
        {t('title')}
      </h2>
      <p className="support" style={{ marginBottom: 16 }}>
        {t('stubNote')}
      </p>
      <form className="persona-form" onSubmit={onSubmit}>
        {error ? (
          <p className="error-text" role="alert">
            {error}
          </p>
        ) : null}
        <div className="field">
          <label htmlFor="sync-blog">{t('blog')}</label>
          <input id="sync-blog" name="blog" type="text" placeholder="https://…" />
        </div>
        <div className="field">
          <label htmlFor="sync-x">{t('x')}</label>
          <input id="sync-x" name="x" type="text" placeholder="@handle" />
        </div>
        <div className="field">
          <label htmlFor="sync-threads">{t('threads')}</label>
          <input id="sync-threads" name="threads" type="text" placeholder="@handle" />
        </div>
        <div className="cta-row">
          <button className="btn btn-accent" type="submit" disabled={pending}>
            {pending ? t('enqueueing') : t('enqueue')}
          </button>
        </div>
      </form>
      {job ? (
        <div className="sync-status" role="status" aria-live="polite">
          <p className="eyebrow">
            {t('status')}: {t(`status_${job.status}`)}
          </p>
          <p className="support" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            {job.id}
          </p>
          {job.error ? (
            <p className="error-text" role="alert">
              {job.error}
            </p>
          ) : null}
          {job.adapterResults.length > 0 ? (
            <ul className="sync-results">
              {job.adapterResults.map((r) => (
                <li key={`${r.source}-${r.handle}`}>
                  <strong>{r.source}</strong>: {r.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
