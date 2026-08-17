import { RateLimitService } from './rate-limit.service.js';

describe('RateLimitService', () => {
  const prevRedis = process.env.REDIS_URL;
  const prevMax = process.env.RATE_LIMIT_MAX;
  const prevWindow = process.env.RATE_LIMIT_WINDOW_MS;

  beforeEach(() => {
    delete process.env.REDIS_URL;
    process.env.RATE_LIMIT_MAX = '3';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
  });

  afterEach(() => {
    if (prevRedis === undefined) delete process.env.REDIS_URL;
    else process.env.REDIS_URL = prevRedis;
    if (prevMax === undefined) delete process.env.RATE_LIMIT_MAX;
    else process.env.RATE_LIMIT_MAX = prevMax;
    if (prevWindow === undefined) delete process.env.RATE_LIMIT_WINDOW_MS;
    else process.env.RATE_LIMIT_WINDOW_MS = prevWindow;
  });

  it('fixed window allows up to max then denies (memory fallback)', async () => {
    const rl = new RateLimitService();
    const a = await rl.consume('account:u1');
    const b = await rl.consume('account:u1');
    const c = await rl.consume('account:u1');
    const d = await rl.consume('account:u1');
    expect(a.allowed && b.allowed && c.allowed).toBe(true);
    expect(d.allowed).toBe(false);
    expect(d.remaining).toBe(0);
  });

  it('consumeForActor checks key and account buckets', async () => {
    const rl = new RateLimitService();
    const ok = await rl.consumeForActor({ userId: 'u1', apiKeyId: 'k1' });
    expect(ok.allowed).toBe(true);
    await rl.consumeForActor({ userId: 'u1', apiKeyId: 'k1' });
    await rl.consumeForActor({ userId: 'u1', apiKeyId: 'k1' });
    const denied = await rl.consumeForActor({ userId: 'u1', apiKeyId: 'k1' });
    expect(denied.allowed).toBe(false);
  });
});
