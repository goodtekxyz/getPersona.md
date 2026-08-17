import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DEFAULT_WRITE_MAX_LENGTH,
  writeSchema,
  type WriteInput,
  type WriteResult,
} from '@getpersona/shared';
import type { Repository } from 'typeorm';
import { GrowthService } from '../growth/growth.service.js';
import { LlmWrapperClient } from './llm-wrapper.client.js';
import { interpretJudgeVerdict, writeLawCodes } from './physical-laws.js';
import {
  buildDraftPrompt,
  buildJudgePrompt,
  flattenSourceText,
  parseAgentJson,
  type ProjectBundle,
  type WriteJobView,
} from './write-prompts.js';
import type { WriteDto } from './dto/write.dto.js';
import { WriteRunEntity, type WriteRunTrace } from './write-run.entity.js';

@Injectable()
export class WriteService {
  constructor(
    private readonly growth: GrowthService,
    @InjectRepository(WriteRunEntity)
    private readonly runs: Repository<WriteRunEntity>,
    private readonly llm: LlmWrapperClient,
  ) {}

  /**
   * Write path: ownership via project() → draft → physical laws → judge (pass|fail, no rewrite)
   * → persist run → { status: text|skip, ... }.
   *
   * LLM only via LlmWrapperClient (env LLM_WRAPPER_URL). Unset/unreachable → deterministic stub.
   */
  async write(actorUserId: string, raw: WriteDto): Promise<WriteResult> {
    const input = writeSchema.parse(raw);
    const project = (await this.growth.project(actorUserId, {
      personaId: input.personaId,
      kind: input.kind,
      channel: input.channel,
      language: input.language,
      query: input.query,
      limit: input.limit,
    })) as ProjectBundle;

    const memoryUsed = project.memoryWindow.map((m) => m.id);
    const job = toJobView(input);
    const sourceFlat = flattenSourceText(job);
    const maxChars = input.constraints?.maxLength ?? DEFAULT_WRITE_MAX_LENGTH;
    const trace: WriteRunTrace = {
      project: {
        personaId: project.personaId,
        kind: project.kind,
        memoryCount: memoryUsed.length,
      },
    };

    const draftLlm = await this.llm.complete({
      messages: [{ role: 'user', content: buildDraftPrompt(project, job) }],
    });
    const draftParsed = parseAgentJson(draftLlm.text);
    trace.llm = {
      draftStubbed: draftLlm.stubbed,
      draftLive: draftLlm.live,
    };
    trace.draft = {
      skip: draftParsed.skip === true,
      reason: typeof draftParsed.reason === 'string' ? draftParsed.reason : undefined,
      hasText: Boolean(String(draftParsed.text ?? draftParsed.artifact ?? '').trim()),
    };

    if (draftParsed.skip === true) {
      return this.persist(actorUserId, input, {
        status: 'skip',
        reason: String(draftParsed.reason ?? 'draft_skip'),
        memoryUsed,
        trace,
      });
    }

    const artifact = String(draftParsed.text ?? draftParsed.artifact ?? '').trim();
    if (!artifact) {
      return this.persist(actorUserId, input, {
        status: 'skip',
        reason: 'empty_draft',
        memoryUsed,
        trace,
      });
    }

    const language = input.language ?? project.language ?? null;
    const laws = writeLawCodes({
      text: artifact,
      source: sourceFlat,
      maxChars,
      language,
    });
    trace.laws = laws;
    if (laws.length > 0) {
      return this.persist(actorUserId, input, {
        status: 'skip',
        reason: laws[0],
        memoryUsed,
        trace,
      });
    }

    const judgeLlm = await this.llm.complete({
      messages: [{ role: 'user', content: buildJudgePrompt(project, job, artifact) }],
    });
    const judgeParsed = parseAgentJson(judgeLlm.text);
    // Physical law: judge does not rewrite — ignore any text field.
    const { text: _ignoredRewrite, ...judgeWithoutText } = judgeParsed;
    void _ignoredRewrite;
    const verdict = interpretJudgeVerdict(judgeWithoutText);
    trace.llm = {
      ...trace.llm,
      judgeStubbed: judgeLlm.stubbed,
      judgeLive: judgeLlm.live,
    };
    trace.judge = {
      verdict: verdict.verdict,
      reason: verdict.reason,
      codes: verdict.codes,
      // Prove we did not adopt rewrite text from the model.
      rewriteIgnored: typeof judgeParsed.text === 'string',
    };

    if (verdict.verdict !== 'pass') {
      return this.persist(actorUserId, input, {
        status: 'skip',
        reason: verdict.reason ?? verdict.codes[0] ?? 'judge_fail',
        memoryUsed,
        trace,
      });
    }

    // Re-check laws after judge (defense in depth; judge must not rewrite).
    const postLaws = writeLawCodes({
      text: artifact,
      source: sourceFlat,
      maxChars,
      language,
    });
    if (postLaws.length > 0) {
      return this.persist(actorUserId, input, {
        status: 'skip',
        reason: postLaws[0],
        memoryUsed,
        trace: { ...trace, laws: postLaws },
      });
    }

    return this.persist(actorUserId, input, {
      status: 'text',
      text: artifact,
      memoryUsed,
      trace,
    });
  }

  async getRun(actorUserId: string, runId: string) {
    const run = await this.runs.findOne({ where: { id: runId } });
    if (!run || run.actorUserId !== actorUserId) {
      return null;
    }
    return serializeRun(run);
  }

  private async persist(
    actorUserId: string,
    input: WriteInput,
    outcome: {
      status: 'text' | 'skip';
      text?: string;
      reason?: string;
      memoryUsed: string[];
      trace: WriteRunTrace;
    },
  ): Promise<WriteResult> {
    const saved = await this.runs.save(
      this.runs.create({
        personaId: input.personaId,
        actorUserId,
        kind: input.kind,
        status: outcome.status,
        text: outcome.text ?? null,
        reason: outcome.reason ?? null,
        memoryUsed: outcome.memoryUsed,
        trace: outcome.trace,
      }),
    );

    return {
      status: outcome.status,
      ...(outcome.text !== undefined ? { text: outcome.text } : {}),
      ...(outcome.reason !== undefined ? { reason: outcome.reason } : {}),
      runId: saved.id,
      memoryUsed: outcome.memoryUsed,
    };
  }
}

function toJobView(input: WriteInput): WriteJobView {
  return {
    kind: input.kind,
    channel: input.channel,
    language: input.language,
    source: input.source ?? {},
    subjects: input.subjects,
    constraints: input.constraints,
  };
}

function serializeRun(run: WriteRunEntity) {
  return {
    runId: run.id,
    personaId: run.personaId,
    kind: run.kind,
    status: run.status,
    text: run.text,
    reason: run.reason,
    memoryUsed: run.memoryUsed,
    trace: run.trace,
    createdAt: run.createdAt.toISOString(),
  };
}
