import { physicalFailCodes, writeLawCodes, interpretJudgeVerdict } from './physical-laws.js';

describe('physicalFailCodes', () => {
  it('passes clean text', () => {
    expect(physicalFailCodes('응원합니다!')).toEqual([]);
  });

  it('flags internal leak', () => {
    expect(physicalFailCodes('getPersona 카드 보고 씀')).toEqual(['internal_leak']);
    expect(physicalFailCodes('personaAgent wrote this')).toEqual(['internal_leak']);
  });

  it('allows leak tokens already in source', () => {
    expect(physicalFailCodes('getPersona?', 'what is getPersona')).toEqual([]);
  });
});

describe('writeLawCodes', () => {
  it('flags over_length', () => {
    expect(writeLawCodes({ text: 'abcd', maxChars: 3 })).toEqual(['over_length']);
  });
});

describe('interpretJudgeVerdict', () => {
  it('pass ignores rewrite text', () => {
    const r = interpretJudgeVerdict({ verdict: 'pass', text: 'rewritten line' });
    expect(r.verdict).toBe('pass');
    expect(r.codes).toEqual([]);
  });

  it('fail does not rewrite', () => {
    const r = interpretJudgeVerdict({
      verdict: 'fail',
      text: 'should be ignored',
      reason: 'off_voice',
      codes: ['off_voice'],
    });
    expect(r.verdict).toBe('fail');
    expect(r.reason).toBe('off_voice');
    expect(r.codes).toEqual(['off_voice']);
  });

  it('invalid verdict fails', () => {
    expect(interpretJudgeVerdict({}).verdict).toBe('fail');
  });
});
