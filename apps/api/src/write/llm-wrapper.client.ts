/**
 * HTTP client for llm_wrapper gateway.
 *
 * Env:
 * - LLM_WRAPPER_URL — gateway base (e.g. http://127.0.0.1:8787). If unset or unreachable,
 *   callers should use the deterministic stub (see LlmWrapperClient.complete).
 * - LLM_WRAPPER_MODEL — pool alias (default coding-codex)
 * - LLM_WRAPPER_TOKEN or GATEWAY_SERVICE_TOKEN — Bearer for /v1/chat
 */

export type LlmChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type LlmCompleteInput = {
  messages: LlmChatMessage[];
  /** Optional model override. */
  model?: string;
};

export type LlmCompleteResult = {
  text: string;
  /** true when LLM_WRAPPER_URL was used and returned OK. */
  live: boolean;
  stubbed: boolean;
};

export type LlmWrapperConfig = {
  baseUrl?: string | null;
  token?: string | null;
  model?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

export function llmWrapperConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl?: typeof fetch,
): LlmWrapperConfig {
  const baseUrl = env.LLM_WRAPPER_URL?.trim() || null;
  const token = env.LLM_WRAPPER_TOKEN?.trim() || env.GATEWAY_SERVICE_TOKEN?.trim() || null;
  return {
    baseUrl,
    token,
    model: env.LLM_WRAPPER_MODEL?.trim() || 'coding-codex',
    timeoutMs: Number(env.LLM_WRAPPER_TIMEOUT_MS ?? 60_000) || 60_000,
    ...(fetchImpl ? { fetchImpl } : {}),
  };
}

function extractText(json: Record<string, unknown>): string {
  const output = json.output as { answer?: string; text?: string } | undefined;
  return String(
    output?.answer ?? output?.text ?? json.output_text ?? json.answer ?? json.text ?? '',
  ).trim();
}

/**
 * Deterministic stub used when URL is unset or the gateway is unreachable.
 * Still returns parseable draft/judge JSON so tests and local CI stay valid.
 */
export function stubComplete(input: LlmCompleteInput): LlmCompleteResult {
  const joined = input.messages.map((m) => m.content).join('\n');
  const isJudge = /you are the judge/i.test(joined) || /\bverdict\b/i.test(joined);

  if (isJudge) {
    const artifactMatch = joined.match(/artifact:\s*\n([\s\S]*?)(?:\nartifact revision:|$)/i);
    const artifact = (artifactMatch?.[1] ?? '').trim();
    if (!artifact || /getPersona|personaAgent|L0 compile/i.test(artifact)) {
      return {
        text: JSON.stringify({
          verdict: 'fail',
          codes: ['stub_fail'],
          reason: 'stub_reject',
        }),
        live: false,
        stubbed: true,
      };
    }
    return {
      text: JSON.stringify({ verdict: 'pass' }),
      live: false,
      stubbed: true,
    };
  }

  // Draft stub: skip only on explicit cue or totally empty source.
  if (/\bSKIP_PLEASE\b/.test(joined)) {
    return {
      text: JSON.stringify({ skip: true, reason: 'stub_skip_cue' }),
      live: false,
      stubbed: true,
    };
  }
  const noBrief = !/brief:\s+\S/i.test(joined);
  const noText = /source text:\s*\(none\)/i.test(joined);
  const noThread = !/thread:\s*\n-/i.test(joined);
  if (noBrief && noText && noThread) {
    return {
      text: JSON.stringify({ skip: true, reason: 'stub_empty_source' }),
      live: false,
      stubbed: true,
    };
  }

  const kindMatch = joined.match(/kind:\s*(post|comment|reply)/i);
  const kind = kindMatch?.[1] ?? 'post';
  const line =
    kind === 'comment'
      ? 'Noted — stub comment.'
      : kind === 'reply'
        ? 'Got it — stub reply.'
        : 'Shipping note — stub post.';

  return {
    text: JSON.stringify({ text: line }),
    live: false,
    stubbed: true,
  };
}

export class LlmWrapperClient {
  constructor(private readonly config: LlmWrapperConfig = llmWrapperConfigFromEnv()) {}

  /** Live call when configured; otherwise or on network/HTTP failure → stub. */
  async complete(input: LlmCompleteInput): Promise<LlmCompleteResult> {
    const base = this.config.baseUrl?.replace(/\/$/, '');
    if (!base) {
      return stubComplete(input);
    }

    const fetchImpl = this.config.fetchImpl ?? fetch;
    const model = input.model ?? this.config.model ?? 'coding-codex';
    const prompt = input.messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs ?? 60_000);
      const res = await fetchImpl(`${base}/v1/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          input: prompt,
          persist: false,
          timeout_ms: this.config.timeoutMs ?? 60_000,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        return stubComplete(input);
      }
      const text = extractText(json);
      if (!text) {
        return stubComplete(input);
      }
      return { text, live: true, stubbed: false };
    } catch {
      return stubComplete(input);
    }
  }
}
