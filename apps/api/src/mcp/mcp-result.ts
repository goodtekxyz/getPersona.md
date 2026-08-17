import { HttpException } from '@nestjs/common';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ZodError } from 'zod';

/** Serialize a successful Nest service payload as MCP tool text (JSON). */
export function toolJson(data: unknown): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/** Map Nest / Zod / unknown errors into MCP tool error results (no throw). */
export function toolError(err: unknown): CallToolResult {
  if (err instanceof ZodError) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'validation_error',
            issues: err.issues,
          }),
        },
      ],
    };
  }
  if (err instanceof HttpException) {
    const status = err.getStatus();
    const body = err.getResponse();
    const message =
      typeof body === 'string'
        ? body
        : typeof body === 'object' && body && 'message' in body
          ? (body as { message: string | string[] }).message
          : err.message;
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'http_error',
            statusCode: status,
            message,
          }),
        },
      ],
    };
  }
  const message = err instanceof Error ? err.message : 'Internal server error';
  return {
    isError: true,
    content: [{ type: 'text', text: JSON.stringify({ error: 'internal_error', message }) }],
  };
}
