/** Physical laws for public write output (docs/project/03-architecture.md). No LLM. */

const LEAK = /getPersona|personaAgent|PERSONA\.md|task_profile|card_terms|L0 compile|dispatchId/gi;

export const DEFAULT_PUBLIC_LINE_MAX = 280;

/**
 * Fail if public text leaks platform internals.
 * Hits already present in `source` are allowed (quoting the user).
 */
export function physicalFailCodes(text: string, source = ''): string[] {
  const hits = text.match(LEAK) ?? [];
  const allowed = source.toLowerCase();
  const leaked = hits.filter((hit) => !allowed.includes(hit.toLowerCase()));
  return leaked.length > 0 ? ['internal_leak'] : [];
}

export function writeLawCodes(input: {
  text: string;
  source?: string;
  maxChars?: number;
}): string[] {
  const text = input.text.trim();
  const codes = new Set(physicalFailCodes(text, input.source ?? ''));
  const max = input.maxChars ?? DEFAULT_PUBLIC_LINE_MAX;
  if (text.length > max) codes.add('over_length');
  return [...codes];
}

/**
 * Judge may only pass|fail. Any replacement `text` in the model payload is ignored.
 */
export function interpretJudgeVerdict(parsed: Record<string, unknown>): {
  verdict: 'pass' | 'fail';
  reason?: string;
  codes: string[];
} {
  if (parsed.verdict === 'pass') {
    return { verdict: 'pass', codes: [] };
  }
  if (parsed.verdict === 'fail') {
    const codes = Array.isArray(parsed.codes) ? parsed.codes.map(String) : ['judge_fail'];
    return {
      verdict: 'fail',
      reason: typeof parsed.reason === 'string' ? parsed.reason : 'judge_fail',
      codes,
    };
  }
  return { verdict: 'fail', reason: 'invalid_judge_output', codes: ['invalid_judge_output'] };
}
