'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export function SignInForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '');
    const password = String(fd.get('password') ?? '');
    const { error: err } = await authClient.signIn.email({
      email,
      password,
    });
    setPending(false);
    if (err) {
      setError(err.message || t('errorGeneric'));
      return;
    }
    router.push('/');
  }

  return (
    <div className="auth-column">
      <h1 className="display-md" style={{ marginBottom: 24 }}>
        {t('signInTitle')}
      </h1>
      <form className="auth-panel" onSubmit={onSubmit}>
        {error ? (
          <p className="error-text" role="alert">
            {error}
          </p>
        ) : null}
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
            autoComplete="current-password"
            required
          />
        </div>
        <button
          className="btn btn-accent"
          type="submit"
          disabled={pending}
          style={{ width: '100%' }}
        >
          {t('submitSignIn')}
        </button>
        <p className="auth-links">
          {t('needAccount')} <Link href="/sign-up">{t('submitSignUp')}</Link>
        </p>
        <p className="oauth-stub">{t('oauthStub')}</p>
      </form>
    </div>
  );
}
