import { LlmWrapperClient, stubComplete, llmWrapperConfigFromEnv } from './llm-wrapper.client.js';

describe('stubComplete', () => {
  it('returns draft JSON for post', () => {
    const r = stubComplete({
      messages: [{ role: 'user', content: 'kind: post\nsource text: hello' }],
    });
    expect(r.stubbed).toBe(true);
    expect(r.live).toBe(false);
    const parsed = JSON.parse(r.text) as { text?: string };
    expect(parsed.text).toMatch(/stub post/i);
  });

  it('returns skip for empty cue', () => {
    const r = stubComplete({
      messages: [{ role: 'user', content: 'kind: post\nSKIP_PLEASE\nsource text: (none)' }],
    });
    const parsed = JSON.parse(r.text) as { skip?: boolean; reason?: string };
    expect(parsed.skip).toBe(true);
  });

  it('judge pass for clean artifact', () => {
    const r = stubComplete({
      messages: [
        {
          role: 'user',
          content: 'You are the judge teammate.\nartifact:\nHello world\nartifact revision: 1',
        },
      ],
    });
    expect(JSON.parse(r.text)).toEqual({ verdict: 'pass' });
  });
});

describe('LlmWrapperClient', () => {
  it('uses stub when URL unset', async () => {
    const client = new LlmWrapperClient({ baseUrl: null });
    const r = await client.complete({
      messages: [{ role: 'user', content: 'kind: comment\nsource text: hi' }],
    });
    expect(r.stubbed).toBe(true);
  });

  it('falls back to stub when fetch fails', async () => {
    const client = new LlmWrapperClient({
      baseUrl: 'http://127.0.0.1:9',
      fetchImpl: async () => {
        throw new Error('down');
      },
    });
    const r = await client.complete({
      messages: [{ role: 'user', content: 'kind: reply\nsource text: hi' }],
    });
    expect(r.stubbed).toBe(true);
    expect(JSON.parse(r.text).text).toMatch(/stub reply/i);
  });

  it('llmWrapperConfigFromEnv reads LLM_WRAPPER_URL', () => {
    const cfg = llmWrapperConfigFromEnv({
      LLM_WRAPPER_URL: 'http://localhost:8787/',
      LLM_WRAPPER_MODEL: 'm1',
      LLM_WRAPPER_TOKEN: 'tok',
    });
    expect(cfg.baseUrl).toBe('http://localhost:8787/');
    expect(cfg.model).toBe('m1');
    expect(cfg.token).toBe('tok');
  });
});
