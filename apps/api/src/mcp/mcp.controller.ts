import {
  Controller,
  All,
  Req,
  Res,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Request, Response } from 'express';
import { ApiKeysService } from '../api-keys/api-keys.service.js';
import {
  extractBearerToken,
  hashApiKey,
  requireScope,
  setRequestActor,
  type Actor,
} from '../auth/actor-types.js';
import { McpServerFactory } from './mcp.server.factory.js';

@ApiTags('mcp')
@ApiBearerAuth('bearer')
@Controller('mcp')
export class McpController {
  constructor(
    private readonly factory: McpServerFactory,
    private readonly apiKeys: ApiKeysService,
  ) {}

  /**
   * Streamable HTTP MCP endpoint (stateless).
   * Auth: Bearer API key only (write scope). Same Nest services as REST `/v1`.
   */
  @All()
  @ApiOperation({
    summary: 'MCP Streamable HTTP',
    description:
      'POST JSON-RPC MCP messages. Authorization: Bearer <api_key>. Tools: list_personas, get_persona, write, remember.',
  })
  async handle(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (req.method === 'GET' || req.method === 'DELETE') {
      res.status(405).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Method not allowed.' },
        id: null,
      });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Method not allowed.' },
        id: null,
      });
      return;
    }

    let actor: Actor;
    try {
      actor = await this.requireApiKeyActor(req);
      setRequestActor(req, actor);
    } catch (err) {
      this.writeAuthError(res, err);
      return;
    }

    const server = this.factory.create(actor);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on('close', () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: err instanceof Error ? err.message : 'Internal server error',
          },
          id: null,
        });
      }
    }
  }

  /** MCP transport accepts API keys only (not session cookies). */
  private async requireApiKeyActor(req: Request): Promise<Actor> {
    const bearer = extractBearerToken(req);
    if (!bearer) {
      throw new UnauthorizedException('Bearer API key required for MCP.');
    }
    const row = await this.apiKeys.lookupByHash(hashApiKey(bearer));
    if (!row || row.revokedAt) {
      throw new UnauthorizedException('Invalid API key.');
    }
    const actor: Actor = {
      userId: row.ownerUserId,
      authType: 'api_key',
      scopes: new Set(row.scopes),
      apiKeyId: row.id,
    };
    requireScope(actor, 'write');
    return actor;
  }

  private writeAuthError(res: Response, err: unknown): void {
    if (err instanceof ForbiddenException) {
      res.status(HttpStatus.FORBIDDEN).json({
        jsonrpc: '2.0',
        error: { code: -32003, message: err.message },
        id: null,
      });
      return;
    }
    if (err instanceof UnauthorizedException) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        jsonrpc: '2.0',
        error: { code: -32001, message: err.message },
        id: null,
      });
      return;
    }
    if (err instanceof HttpException) {
      res.status(err.getStatus()).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: err.message },
        id: null,
      });
      return;
    }
    res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32603, message: 'Internal server error' },
      id: null,
    });
  }
}
