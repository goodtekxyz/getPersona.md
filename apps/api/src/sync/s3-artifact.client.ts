/**
 * Optional S3-compatible artifact store (endpoint: s3.goodtek.xyz).
 * Stub only — no network I/O. Real uploads when credentials are wired later.
 */
export type S3ArtifactClientConfig = {
  endpoint: string;
  bucket: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  enabled: boolean;
};

export type PutArtifactInput = {
  key: string;
  body: string | Buffer;
  contentType?: string;
};

export type PutArtifactResult = {
  key: string;
  stubbed: boolean;
  endpoint: string;
  bucket: string;
};

export function s3ConfigFromEnv(env: NodeJS.ProcessEnv = process.env): S3ArtifactClientConfig {
  const endpoint = (env.S3_ENDPOINT ?? 'https://s3.goodtek.xyz').replace(/\/$/, '');
  const bucket = env.S3_BUCKET ?? 'getpersona';
  const accessKeyId = env.S3_ACCESS_KEY_ID?.trim() || undefined;
  const secretAccessKey = env.S3_SECRET_ACCESS_KEY?.trim() || undefined;
  const region = env.S3_REGION ?? 'auto';
  const enabled = env.S3_ENABLED === 'true' || Boolean(accessKeyId && secretAccessKey);

  return { endpoint, bucket, accessKeyId, secretAccessKey, region, enabled };
}

export class S3ArtifactClient {
  constructor(private readonly config: S3ArtifactClientConfig) {}

  /** Store raw sync artifact. Always stubbed in M7 (no real PUT). */
  async putObject(input: PutArtifactInput): Promise<PutArtifactResult> {
    void input.body;
    void this.config.accessKeyId;
    void this.config.secretAccessKey;
    return {
      key: input.key,
      stubbed: true,
      endpoint: this.config.endpoint,
      bucket: this.config.bucket,
    };
  }

  artifactKey(opts: { personaId: string; jobId: string; source: string }): string {
    return `sync/${opts.personaId}/${opts.jobId}/${opts.source}.json`;
  }
}
