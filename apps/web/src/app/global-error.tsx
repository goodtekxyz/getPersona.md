'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#0a0a0b',
          color: '#ededee',
          fontFamily: 'system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, margin: '0 0 12px' }}>Something went wrong</h1>
          <p style={{ color: 'rgba(237,237,238,0.6)', margin: '0 0 16px' }}>
            {error.message || 'Unexpected error'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              height: 40,
              padding: '0 16px',
              borderRadius: 10,
              border: 'none',
              background: '#a3e635',
              color: '#0a0a0b',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
