import { PRODUCT_NAME } from '@getpersona/shared';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 24px',
        maxWidth: 1120,
        margin: '0 auto',
      }}
    >
      <p
        style={{
          fontSize: 12,
          letterSpacing: '-0.01em',
          color: 'rgba(237,237,238,0.38)',
          marginBottom: 16,
        }}
      >
        PERSONA PLATFORM
      </p>
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(36px, 6vw, 64px)',
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          fontWeight: 500,
          margin: 0,
        }}
      >
        {PRODUCT_NAME}
      </h1>
      <p style={{ color: 'rgba(237,237,238,0.6)', maxWidth: 420, marginTop: 16 }}>
        Personas you can register, sync, and write with. Scaffold — auth and agents come next.
      </p>
    </main>
  );
}
