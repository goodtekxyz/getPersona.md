import {
  physicalFailCodes,
  writeLawCodes,
  languageFailCodes,
  interpretJudgeVerdict,
} from './physical-laws.js';

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

  it('flags internal_leak and over_length together', () => {
    const codes = writeLawCodes({
      text: 'getPersona leaks here and is also long',
      maxChars: 10,
    });
    expect(codes).toContain('internal_leak');
    expect(codes).toContain('over_length');
  });

  it('flags wrong_language for ko request with English-only body', () => {
    expect(
      writeLawCodes({
        text: 'Shipping notes for the release train today.',
        language: 'ko',
      }),
    ).toContain('wrong_language');
  });
});

describe('languageFailCodes', () => {
  it('passes when language omitted or short', () => {
    expect(languageFailCodes('hello world', undefined)).toEqual([]);
    expect(languageFailCodes('hi', 'ko')).toEqual([]);
  });

  it('flags en-only text when language is ko', () => {
    expect(languageFailCodes('This is clearly English prose.', 'ko')).toEqual(['wrong_language']);
  });

  it('flags ko-only text when language is en', () => {
    expect(languageFailCodes('오늘은 배포를 마무리합니다.', 'en')).toEqual(['wrong_language']);
  });

  it('allows matching script', () => {
    expect(languageFailCodes('Shipping notes for today.', 'en')).toEqual([]);
    expect(languageFailCodes('오늘은 배포를 마무리합니다.', 'ko')).toEqual([]);
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
