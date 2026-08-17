'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export function SignUpForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    const terms = fd.get('terms') === 'on';
    if (!terms) {
      setError(t('terms'));
      setPending(false);
      return;
    }
    const { error: err } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    setPending(false);
    if (err) {
      setError(err.message || t('errorGeneric'));
      return;
    }
    router.push('/personas');
  }

  return (
    <div className="auth-column">
      <h1 className="display-md" style={{ marginBottom: 24 }}>
        {t('signUpTitle')}
      </h1>
      <form className="auth-panel" onSubmit={onSubmit}>
        {error ? (
          <p className="error-text" role="alert">
            {error}
          </p>
        ) : null}
        <div className="field">
          <label htmlFor="name">{t('name')}</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">{t('email')}</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">{t('password')}</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <label className="checkbox-row">
          <input type="checkbox" name="terms" required />
          <span>
            {t('terms')} (<Link href="/terms">{t('termsLink')}</Link> ·{' '}
            <Link href="/privacy">{t('privacyLink')}</Link>)
          </span>
        </label>
        <button
          className="btn btn-accent"
          type="submit"
          disabled={pending}
          style={{ width: '100%' }}
        >
          {t('submitSignUp')}
        </button>
        <p className="auth-links">
          {t('haveAccount')} <Link href="/sign-in">{t('submitSignIn')}</Link>
        </p>
        <p className="oauth-stub">{t('oauthStub')}</p>
      </form>
    </div>
  );
}
