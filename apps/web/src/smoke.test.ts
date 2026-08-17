import { describe, expect, it } from 'vitest';
import { PRODUCT_NAME } from '@getpersona/shared';

describe('web smoke', () => {
  it('shares product name', () => {
    expect(PRODUCT_NAME).toBe('getPersona.md');
  });
});
