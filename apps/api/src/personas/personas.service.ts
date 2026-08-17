import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPersonaSchema, patchPersonaSchema } from '@getpersona/shared';
import type { Repository } from 'typeorm';
import { IsNull } from 'typeorm';
import { PersonaEntity } from './persona.entity.js';
import type { CreatePersonaDto, PatchPersonaDto } from './dto/persona.dto.js';

function slugify(displayName: string): string {
  const base = displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return base || 'persona';
}

function toIso(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}

export function serializePersona(entity: PersonaEntity) {
  return {
    id: entity.id,
    ownerUserId: entity.ownerUserId,
    displayName: entity.displayName,
    slug: entity.slug,
    identity: entity.identity,
    voice: entity.voice,
    boundaries: entity.boundaries,
    permissions: entity.permissions,
    isPublic: entity.isPublic,
    archivedAt: toIso(entity.archivedAt),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(PersonaEntity)
    private readonly personas: Repository<PersonaEntity>,
  ) {}

  async create(ownerUserId: string, raw: CreatePersonaDto) {
    const input = createPersonaSchema.parse({
      ...raw,
      boundaries: raw.boundaries ?? { doNotSay: [] },
      permissions: raw.permissions ?? { visibility: 'private', automation: 'none' },
    });

    const isPublic = input.isPublic ?? input.permissions.visibility === 'public';
    const permissions = {
      ...input.permissions,
      visibility: isPublic ? ('public' as const) : ('private' as const),
    };

    const slug = input.slug ?? slugify(input.displayName);
    await this.assertSlugAvailable(ownerUserId, slug);

    const entity = this.personas.create({
      ownerUserId,
      displayName: input.displayName,
      slug,
      identity: input.identity,
      voice: input.voice,
      boundaries: input.boundaries,
      permissions,
      isPublic,
      archivedAt: null,
    });
    const saved = await this.personas.save(entity);
    return serializePersona(saved);
  }

  async listOwned(ownerUserId: string) {
    const rows = await this.personas.find({
      where: { ownerUserId, archivedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return rows.map(serializePersona);
  }

  async getForViewer(id: string, viewerUserId: string) {
    const entity = await this.findById(id);
    if (entity.ownerUserId !== viewerUserId && !entity.isPublic) {
      throw new ForbiddenException("You don't have access to this persona.");
    }
    return serializePersona(entity);
  }

  async patch(id: string, ownerUserId: string, raw: PatchPersonaDto) {
    const input = patchPersonaSchema.parse(raw);
    const entity = await this.requireOwner(id, ownerUserId);

    if (input.displayName !== undefined) entity.displayName = input.displayName;
    if (input.slug !== undefined && input.slug !== entity.slug) {
      await this.assertSlugAvailable(ownerUserId, input.slug, id);
      entity.slug = input.slug;
    }
    if (input.identity) {
      entity.identity = { ...entity.identity, ...input.identity };
    }
    if (input.voice) {
      entity.voice = { ...entity.voice, ...input.voice };
    }
    if (input.boundaries) {
      entity.boundaries = { ...entity.boundaries, ...input.boundaries };
    }
    if (input.permissions) {
      entity.permissions = { ...entity.permissions, ...input.permissions };
    }
    if (input.isPublic !== undefined) {
      entity.isPublic = input.isPublic;
      entity.permissions = {
        ...entity.permissions,
        visibility: input.isPublic ? 'public' : 'private',
      };
    } else if (input.permissions?.visibility !== undefined) {
      entity.isPublic = input.permissions.visibility === 'public';
    }

    const saved = await this.personas.save(entity);
    return serializePersona(saved);
  }

  async archive(id: string, ownerUserId: string) {
    const entity = await this.requireOwner(id, ownerUserId);
    if (!entity.archivedAt) {
      entity.archivedAt = new Date();
      await this.personas.save(entity);
    }
    return serializePersona(entity);
  }

  async fork(sourceId: string, ownerUserId: string) {
    const source = await this.findById(sourceId);
    if (!source.isPublic || source.archivedAt) {
      throw new ForbiddenException('Only public personas can be forked.');
    }

    const baseSlug = `${source.slug}-fork`;
    let slug = baseSlug.slice(0, 64);
    let n = 1;
    while (await this.personas.existsBy({ ownerUserId, slug })) {
      const suffix = `-${n++}`;
      slug = `${baseSlug.slice(0, 64 - suffix.length)}${suffix}`;
    }

    const entity = this.personas.create({
      ownerUserId,
      displayName: `${source.displayName} (fork)`,
      slug,
      identity: { ...source.identity },
      voice: {
        ...source.voice,
        sampleSentences: [...source.voice.sampleSentences],
      },
      boundaries: { doNotSay: [...source.boundaries.doNotSay] },
      permissions: {
        visibility: 'private',
        automation: source.permissions.automation,
      },
      isPublic: false,
      archivedAt: null,
    });
    const saved = await this.personas.save(entity);
    return serializePersona(saved);
  }

  private async findById(id: string): Promise<PersonaEntity> {
    const entity = await this.personas.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Persona not found.');
    }
    return entity;
  }

  private async requireOwner(id: string, ownerUserId: string): Promise<PersonaEntity> {
    const entity = await this.findById(id);
    if (entity.ownerUserId !== ownerUserId) {
      throw new ForbiddenException("You don't have access to this persona.");
    }
    return entity;
  }

  private async assertSlugAvailable(ownerUserId: string, slug: string, excludeId?: string) {
    const existing = await this.personas.findOne({ where: { ownerUserId, slug } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Slug already in use for this account.');
    }
  }
}
