/** Physical laws for public write output (docs/project/03-architecture.md). No LLM. */

const LEAK = /getPersona|personaAgent|PERSONA\.md|task_profile|card_terms|L0 compile|dispatchId/gi;

const HANGUL = /[\uAC00-\uD7A3]/g;
const LATIN = /[A-Za-z]/g;

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

/**
 * Heuristic language mismatch (ko ↔ en). Short / mixed / unknown langs → no fail.
 * Does not require a golden sentence — only script dominance vs requested language.
 */
export function languageFailCodes(text: string, language?: string | null): string[] {
  if (!language) return [];
  const lang = language.trim().toLowerCase();
  const hangul = (text.match(HANGUL) ?? []).length;
  const latin = (text.match(LATIN) ?? []).length;
  const letters = hangul + latin;
  if (letters < 8) return [];

  const isKo = lang === 'ko' || lang === 'kr' || lang.startsWith('ko-');
  const isEn = lang === 'en' || lang.startsWith('en-');
  if (!isKo && !isEn) return [];

  if (isKo && hangul === 0 && latin / letters >= 0.7) {
    return ['wrong_language'];
  }
  if (isEn && latin === 0 && hangul / letters >= 0.7) {
    return ['wrong_language'];
  }
  return [];
}

export function writeLawCodes(input: {
  text: string;
  source?: string;
  maxChars?: number;
  language?: string | null;
}): string[] {
  const text = input.text.trim();
  const codes = new Set(physicalFailCodes(text, input.source ?? ''));
  const max = input.maxChars ?? DEFAULT_PUBLIC_LINE_MAX;
  if (text.length > max) codes.add('over_length');
  for (const code of languageFailCodes(text, input.language)) {
    codes.add(code);
  }
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
