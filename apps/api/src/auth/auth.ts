import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const isProd = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;

const trustedOrigins = (
  process.env.TRUSTED_ORIGINS ??
  process.env.WEB_ORIGIN ??
  'http://localhost:3000'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const requireEmailVerification =
  process.env.REQUIRE_EMAIL_VERIFICATION === 'true' || (isProd && Boolean(process.env.SMTP_HOST));

function buildSocialProviders() {
  const providers: Record<string, { clientId: string; clientSecret: string }> = {};
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }
  return providers;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Better Auth 1.6 — email/password + optional OAuth/SMTP stubs.
 * Local: no AUTH_COOKIE_DOMAIN (host-only). Prod: AUTH_COOKIE_DOMAIN=.getpersona.md
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3001',
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification,
  },
  emailVerification: {
    sendOnSignUp: requireEmailVerification,
    async sendVerificationEmail({ user, url }) {
      // SMTP stub — log in non-prod so local works without a real mail server.
      if (!process.env.SMTP_HOST) {
        console.info('[auth] verification email stub', { to: user.email, url });
        return;
      }
      console.info('[auth] SMTP configured but send not wired yet', {
        host: process.env.SMTP_HOST,
        to: user.email,
      });
    },
  },
  socialProviders: buildSocialProviders(),
  advanced: {
    ...(cookieDomain
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: cookieDomain,
          },
        }
      : {}),
    useSecureCookies: isProd,
  },
});

export type Auth = typeof auth;
