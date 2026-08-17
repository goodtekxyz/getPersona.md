import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { toolError, toolJson } from './mcp-result.js';

describe('mcp-result', () => {
  it('toolJson stringifies payload', () => {
    const result = toolJson({ items: [1] });
    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toMatchObject({ type: 'text' });
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual({ items: [1] });
  });

  it('toolError maps UnauthorizedException', () => {
    const result = toolError(new UnauthorizedException('Invalid API key.'));
    expect(result.isError).toBe(true);
    const body = JSON.parse((result.content[0] as { text: string }).text) as {
      statusCode: number;
      message: string | string[];
    };
    expect(body.statusCode).toBe(401);
  });

  it('toolError maps ForbiddenException', () => {
    const result = toolError(new ForbiddenException('Missing required scope: write.'));
    expect(result.isError).toBe(true);
    const body = JSON.parse((result.content[0] as { text: string }).text) as {
      statusCode: number;
    };
    expect(body.statusCode).toBe(403);
  });
});
