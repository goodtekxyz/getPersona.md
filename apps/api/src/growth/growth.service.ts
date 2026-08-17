import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  promoteSchema,
  projectSchema,
  rememberSchema,
  requiresPromoteGate,
} from '@getpersona/shared';
import type { Repository } from 'typeorm';
import { PersonasService, serializePersona } from '../personas/personas.service.js';
import { CandidateEntity } from './candidate.entity.js';
import { EpisodeEntity } from './episode.entity.js';
import { GrowthAuditEntity } from './growth-audit.entity.js';
import { LtmMemoryEntity } from './ltm-memory.entity.js';
import type { PromoteDto, ProjectDto, RememberDto } from './dto/growth.dto.js';

function toIso(d: Date | null | undefined): string | null {
  return d ? d.toISOString() : null;
}

function serializeEpisode(e: EpisodeEntity) {
  return {
    id: e.id,
    personaId: e.personaId,
    sourceKind: e.sourceKind,
    sourceId: e.sourceId,
    summary: e.summary,
    createdAt: e.createdAt.toISOString(),
  };
}

function serializeCandidate(c: CandidateEntity) {
  return {
    id: c.id,
    personaId: c.personaId,
    episodeId: c.episodeId,
    kind: c.kind,
    payload: c.payload,
    status: c.status,
    promotedAt: toIso(c.promotedAt),
    createdAt: c.createdAt.toISOString(),
  };
}

function serializeLtm(m: LtmMemoryEntity) {
  return {
    id: m.id,
    personaId: m.personaId,
    candidateId: m.candidateId,
    kind: m.kind,
    payload: m.payload,
    summary: m.summary,
    createdAt: m.createdAt.toISOString(),
  };
}

function payloadMatchesQuery(payload: Record<string, unknown>, query: string): boolean {
  const q = query.toLowerCase();
  try {
    return JSON.stringify(payload).toLowerCase().includes(q);
  } catch {
    return false;
  }
}

@Injectable()
export class GrowthService {
  constructor(
    private readonly personas: PersonasService,
    @InjectRepository(EpisodeEntity)
    private readonly episodes: Repository<EpisodeEntity>,
    @InjectRepository(CandidateEntity)
    private readonly candidates: Repository<CandidateEntity>,
    @InjectRepository(LtmMemoryEntity)
    private readonly ltm: Repository<LtmMemoryEntity>,
    @InjectRepository(GrowthAuditEntity)
    private readonly audits: Repository<GrowthAuditEntity>,
  ) {}

  async remember(actorUserId: string, raw: RememberDto) {
    const input = rememberSchema.parse(raw);
    await this.personas.requireOwnedActive(input.personaId, actorUserId);

    const existing = await this.episodes.findOne({
      where: {
        personaId: input.personaId,
        sourceKind: input.sourceKind,
        sourceId: input.sourceId,
      },
    });

    if (existing) {
      const candidate = await this.candidates.findOne({
        where: { episodeId: existing.id },
        order: { createdAt: 'ASC' },
      });
      if (!candidate) {
        throw new NotFoundException('Idempotent episode missing candidate.');
      }
      return {
        idempotent: true,
        episode: serializeEpisode(existing),
        candidate: serializeCandidate(candidate),
      };
    }

    const episode = await this.episodes.save(
      this.episodes.create({
        personaId: input.personaId,
        sourceKind: input.sourceKind,
        sourceId: input.sourceId,
        summary: input.summary,
      }),
    );

    const candidate = await this.candidates.save(
      this.candidates.create({
        personaId: input.personaId,
        episodeId: episode.id,
        kind: input.candidate.kind,
        payload: input.candidate.payload,
        status: 'pending',
        promotedAt: null,
      }),
    );

    await this.writeAudit(input.personaId, actorUserId, 'remember', {
      episodeId: episode.id,
      candidateId: candidate.id,
      sourceKind: input.sourceKind,
      sourceId: input.sourceId,
      kind: candidate.kind,
      idempotent: false,
    });

    return {
      idempotent: false,
      episode: serializeEpisode(episode),
      candidate: serializeCandidate(candidate),
    };
  }

  async listCandidates(actorUserId: string, personaId: string, status?: string) {
    await this.personas.requireOwnedActive(personaId, actorUserId);
    const where: { personaId: string; status?: 'pending' | 'promoted' | 'rejected' } = {
      personaId,
    };
    if (status === 'pending' || status === 'promoted' || status === 'rejected') {
      where.status = status;
    }
    const rows = await this.candidates.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return { items: rows.map(serializeCandidate) };
  }

  async promote(actorUserId: string, raw: PromoteDto) {
    const input = promoteSchema.parse(raw);
    const candidate = await this.candidates.findOne({ where: { id: input.candidateId } });
    if (!candidate) {
      throw new NotFoundException('Candidate not found.');
    }
    await this.personas.requireOwnedActive(candidate.personaId, actorUserId);

    if (candidate.status === 'promoted') {
      const existingLtm = await this.ltm.findOne({ where: { candidateId: candidate.id } });
      return {
        alreadyPromoted: true,
        candidate: serializeCandidate(candidate),
        ltm: existingLtm ? serializeLtm(existingLtm) : null,
      };
    }
    if (candidate.status !== 'pending') {
      throw new BadRequestException(`Candidate is ${candidate.status}, not pending.`);
    }

    if (requiresPromoteGate(candidate.kind) && input.confirmGate !== true) {
      throw new ForbiddenException(
        'Identity, voice, and boundary promotes require confirmGate=true.',
      );
    }

    let ltmRow: LtmMemoryEntity | null = null;

    if (requiresPromoteGate(candidate.kind)) {
      await this.personas.applyPromotedContract(
        candidate.personaId,
        actorUserId,
        candidate.kind as 'identity' | 'voice' | 'boundary',
        candidate.payload,
      );
    } else {
      const episode = await this.episodes.findOne({ where: { id: candidate.episodeId } });
      ltmRow = await this.ltm.save(
        this.ltm.create({
          personaId: candidate.personaId,
          candidateId: candidate.id,
          kind: candidate.kind,
          payload: candidate.payload,
          summary: episode?.summary ?? null,
        }),
      );
    }

    candidate.status = 'promoted';
    candidate.promotedAt = new Date();
    await this.candidates.save(candidate);

    await this.writeAudit(candidate.personaId, actorUserId, 'promote', {
      candidateId: candidate.id,
      kind: candidate.kind,
      ltmId: ltmRow?.id ?? null,
      gatedContract: requiresPromoteGate(candidate.kind),
    });

    return {
      alreadyPromoted: false,
      candidate: serializeCandidate(candidate),
      ltm: ltmRow ? serializeLtm(ltmRow) : null,
    };
  }

  async project(actorUserId: string, raw: ProjectDto) {
    const input = projectSchema.parse(raw);
    const persona = await this.personas.requireOwnedActive(input.personaId, actorUserId);
    const limit = input.limit ?? 8;

    let memories = await this.ltm.find({
      where: { personaId: input.personaId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    if (input.query?.trim()) {
      const q = input.query.trim();
      memories = memories.filter(
        (m) =>
          (m.summary && m.summary.toLowerCase().includes(q.toLowerCase())) ||
          payloadMatchesQuery(m.payload, q),
      );
    }
    memories = memories.slice(0, limit);

    const serialized = serializePersona(persona);
    return {
      personaId: persona.id,
      kind: input.kind,
      channel: input.channel ?? null,
      language: input.language ?? persona.identity.language,
      contract: {
        identity: serialized.identity,
        voice: serialized.voice,
        boundaries: serialized.boundaries,
        permissions: serialized.permissions,
      },
      memoryWindow: memories.map(serializeLtm),
    };
  }

  private async writeAudit(
    personaId: string,
    actorUserId: string,
    action: 'remember' | 'promote',
    detail: Record<string, unknown>,
  ) {
    await this.audits.save(
      this.audits.create({
        personaId,
        actorUserId,
        action,
        detail,
      }),
    );
  }
}
