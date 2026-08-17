import { S3ArtifactClient, s3ConfigFromEnv } from './s3-artifact.client.js';

describe('S3ArtifactClient stub', () => {
  it('defaults endpoint to s3.goodtek.xyz', () => {
    const cfg = s3ConfigFromEnv({});
    expect(cfg.endpoint).toBe('https://s3.goodtek.xyz');
    expect(cfg.bucket).toBe('getpersona');
    expect(cfg.enabled).toBe(false);
  });

  it('putObject is always stubbed (no network)', async () => {
    const client = new S3ArtifactClient(
      s3ConfigFromEnv({
        S3_ENDPOINT: 'https://s3.goodtek.xyz',
        S3_BUCKET: 'getpersona',
        S3_ACCESS_KEY_ID: 'ak',
        S3_SECRET_ACCESS_KEY: 'sk',
        S3_ENABLED: 'true',
      }),
    );
    const key = client.artifactKey({ personaId: 'p1', jobId: 'j1', source: 'x' });
    const put = await client.putObject({ key, body: '{"stub":true}' });
    expect(put.stubbed).toBe(true);
    expect(put.key).toBe('sync/p1/j1/x.json');
    expect(put.endpoint).toBe('https://s3.goodtek.xyz');
  });
});
