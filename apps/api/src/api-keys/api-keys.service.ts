import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createApiKeySchema, type ApiKeyScope } from '@getpersona/shared';
import { randomBytes } from 'node:crypto';
import { IsNull, type Repository } from 'typeorm';
import { hashApiKey } from '../auth/actor-types.js';
import { ApiKeyEntity } from './api-key.entity.js';
import type { CreateApiKeyDto } from './dto/api-key.dto.js';

function toIso(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}

export function serializeApiKey(entity: ApiKeyEntity) {
  return {
    id: entity.id,
    name: entity.name,
    keyPrefix: entity.keyPrefix,
    scopes: entity.scopes,
    revokedAt: toIso(entity.revokedAt),
    createdAt: entity.createdAt.toISOString(),
  };
}

/** Generate plaintext once: gp_live_<24 hex>. */
export function generateApiKeyPlaintext(): { plaintext: string; prefix: string } {
  const secret = randomBytes(24).toString('hex');
  const plaintext = `gp_live_${secret}`;
  const prefix = plaintext.slice(0, 16);
  return { plaintext, prefix };
}

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly keys: Repository<ApiKeyEntity>,
  ) {}

  async create(ownerUserId: string, raw: CreateApiKeyDto) {
    const input = createApiKeySchema.parse(raw);
    const { plaintext, prefix } = generateApiKeyPlaintext();
    const entity = this.keys.create({
      ownerUserId,
      name: input.name,
      keyHash: hashApiKey(plaintext),
      keyPrefix: prefix,
      scopes: input.scopes as ApiKeyScope[],
      revokedAt: null,
    });
    const saved = await this.keys.save(entity);
    return {
      ...serializeApiKey(saved),
      /** Shown once — never stored or listed again. */
      key: plaintext,
    };
  }

  async list(ownerUserId: string) {
    const rows = await this.keys.find({
      where: { ownerUserId },
      order: { createdAt: 'DESC' },
    });
    return { items: rows.map(serializeApiKey) };
  }

  async revoke(ownerUserId: string, id: string) {
    const entity = await this.keys.findOne({ where: { id, ownerUserId } });
    if (!entity) {
      throw new NotFoundException('API key not found.');
    }
    if (!entity.revokedAt) {
      entity.revokedAt = new Date();
      await this.keys.save(entity);
    }
    return serializeApiKey(entity);
  }

  async findByHash(keyHash: string) {
    return this.keys.findOne({
      where: { keyHash, revokedAt: IsNull() },
    });
  }

  /** Lookup used by requireActor — includes revoked so caller can 401. */
  async lookupByHash(keyHash: string) {
    const row = await this.keys.findOne({ where: { keyHash } });
    if (!row) return null;
    return {
      id: row.id,
      ownerUserId: row.ownerUserId,
      scopes: row.scopes,
      revokedAt: row.revokedAt,
    };
  }

  async assertActiveKey(keyHash: string) {
    const row = await this.lookupByHash(keyHash);
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid API key.');
    }
    return row;
  }
}
