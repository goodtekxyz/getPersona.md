import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { rememberSchema, writeSchema } from '@getpersona/shared';
import type { Actor } from '../auth/actor-types.js';
import { requireScope } from '../auth/actor-types.js';
import { PersonasService } from '../personas/personas.service.js';
import { WriteService } from '../write/write.service.js';
import { GrowthService } from '../growth/growth.service.js';
import { toolError, toolJson } from './mcp-result.js';

const getPersonaInput = z.object({
  personaId: z.string().min(1).describe('Persona id to fetch'),
});

/**
 * Builds a fresh McpServer per request (stateless Streamable HTTP).
 * Tools call the same Nest services as REST `/v1`.
 */
@Injectable()
export class McpServerFactory {
  constructor(
    private readonly personas: PersonasService,
    private readonly writeService: WriteService,
    private readonly growth: GrowthService,
  ) {}

  create(actor: Actor): McpServer {
    const server = new McpServer({
      name: 'getpersona',
      version: '1.0.0',
    });

    server.registerTool(
      'list_personas',
      {
        title: 'List personas',
        description: 'List personas owned by the authenticated account (same as GET /v1/personas).',
      },
      async () => {
        try {
          requireScope(actor, 'write');
          const items = await this.personas.listOwned(actor.userId);
          return toolJson({ items });
        } catch (err) {
          return toolError(err);
        }
      },
    );

    server.registerTool(
      'get_persona',
      {
        title: 'Get persona',
        description:
          'Get one persona for the authenticated viewer (owned or public; same core as GET /v1/personas/:id).',
        inputSchema: getPersonaInput.shape,
      },
      async ({ personaId }) => {
        try {
          requireScope(actor, 'write');
          const persona = await this.personas.getForViewer(personaId, actor.userId);
          return toolJson(persona);
        } catch (err) {
          return toolError(err);
        }
      },
    );

    server.registerTool(
      'write',
      {
        title: 'Write',
        description:
          'Run WriteJob as persona → text|skip (same core as POST /v1/write). Requires write scope.',
        inputSchema: writeSchema.shape,
      },
      async (args) => {
        try {
          requireScope(actor, 'write');
          const result = await this.writeService.write(actor.userId, args);
          return toolJson(result);
        } catch (err) {
          return toolError(err);
        }
      },
    );

    server.registerTool(
      'remember',
      {
        title: 'Remember',
        description:
          'Remember an observation as a pending growth candidate (same core as POST /v1/growth/remember). Optional MCP tool; requires write scope.',
        inputSchema: rememberSchema.shape,
      },
      async (args) => {
        try {
          requireScope(actor, 'write');
          const result = await this.growth.remember(actor.userId, args);
          return toolJson(result);
        } catch (err) {
          return toolError(err);
        }
      },
    );

    return server;
  }
}
