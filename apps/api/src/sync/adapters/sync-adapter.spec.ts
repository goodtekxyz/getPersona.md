import { createStubAdapter, STUB_ADAPTERS } from './sync-adapter.js';

describe('stub sync adapters', () => {
  it('exposes blog, x, threads stubs', () => {
    expect(STUB_ADAPTERS.map((a) => a.source).sort()).toEqual(['blog', 'threads', 'x']);
  });

  it('returns stub status without scraping', async () => {
    const blog = createStubAdapter('blog');
    const result = await blog.fetch('https://example.com/@kai', {
      personaId: 'p1',
      jobId: 'j1',
    });
    expect(result.status).toBe('stub');
    expect(result.source).toBe('blog');
    expect(result.handle).toBe('https://example.com/@kai');
    expect(result.message).toMatch(/no scrape/i);
  });
});
