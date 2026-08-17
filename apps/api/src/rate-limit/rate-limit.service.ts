import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

export interface RateLimitConfig {
  windowMs: number;
  maxPerWindow: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Fixed-window counter in Redis (or in-memory fallback when REDIS_URL unset).
 * Limits are checked per key id and per account id.
 */
@Injectable()
export class RateLimitService implements OnModuleDestroy {
  private readonly redis: Redis | null;
  private readonly memory = new Map<string, { count: number; resetAt: number }>();
  readonly config: RateLimitConfig;

  constructor() {
    const url = process.env.REDIS_URL?.trim();
    this.redis = url ? new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true }) : null;
    this.config = {
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
      maxPerWindow: Number(process.env.RATE_LIMIT_MAX ?? 120),
    };
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit().catch(() => undefined);
    }
  }

  async connect(): Promise<void> {
    if (this.redis && this.redis.status === 'wait') {
      await this.redis.connect().catch(() => {
        /* fallback to memory on connect failure */
      });
    }
  }

  async consume(bucket: string): Promise<RateLimitResult> {
    const { windowMs, maxPerWindow } = this.config;
    if (this.redis && (this.redis.status === 'ready' || this.redis.status === 'connecting')) {
      try {
        if (this.redis.status !== 'ready') {
          await this.connect();
        }
        if (this.redis.status === 'ready') {
          return await this.consumeRedis(bucket, windowMs, maxPerWindow);
        }
      } catch {
        /* fall through to memory */
      }
    }
    return this.consumeMemory(bucket, windowMs, maxPerWindow);
  }

  /** Rate-limit both API key and account when present. */
  async consumeForActor(opts: { userId: string; apiKeyId?: string }): Promise<RateLimitResult> {
    const account = await this.consume(`account:${opts.userId}`);
    if (!account.allowed) return account;
    if (opts.apiKeyId) {
      const key = await this.consume(`key:${opts.apiKeyId}`);
      if (!key.allowed) return key;
      return {
        allowed: true,
        remaining: Math.min(account.remaining, key.remaining),
        resetMs: Math.max(account.resetMs, key.resetMs),
      };
    }
    return account;
  }

  private async consumeRedis(
    bucket: string,
    windowMs: number,
    maxPerWindow: number,
  ): Promise<RateLimitResult> {
    const windowId = Math.floor(Date.now() / windowMs);
    const redisKey = `rl:${bucket}:${windowId}`;
    const count = await this.redis!.incr(redisKey);
    if (count === 1) {
      await this.redis!.pexpire(redisKey, windowMs);
    }
    const resetMs = (windowId + 1) * windowMs;
    return {
      allowed: count <= maxPerWindow,
      remaining: Math.max(0, maxPerWindow - count),
      resetMs,
    };
  }

  private consumeMemory(bucket: string, windowMs: number, maxPerWindow: number): RateLimitResult {
    const now = Date.now();
    const windowId = Math.floor(now / windowMs);
    const memKey = `${bucket}:${windowId}`;
    let entry = this.memory.get(memKey);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: (windowId + 1) * windowMs };
      this.memory.set(memKey, entry);
    }
    entry.count += 1;
    return {
      allowed: entry.count <= maxPerWindow,
      remaining: Math.max(0, maxPerWindow - entry.count),
      resetMs: entry.resetAt,
    };
  }
}
