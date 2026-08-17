import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { McpServerFactory } from './mcp.server.factory.js';
import type { Actor } from '../auth/actor-types.js';
import type { PersonasService } from '../personas/personas.service.js';
import type { WriteService } from '../write/write.service.js';
import type { GrowthService } from '../growth/growth.service.js';

describe('McpServerFactory', () => {
  const actor: Actor = {
    userId: 'user-1',
    authType: 'api_key',
    scopes: new Set(['write']),
    apiKeyId: 'key-1',
  };

  it('exposes list_personas, get_persona, write, remember and list_personas hits Nest service', async () => {
    let listOwnedCalls = 0;
    const personas = {
      listOwned: async (userId: string) => {
        listOwnedCalls += 1;
        expect(userId).toBe('user-1');
        return [{ id: 'p1', displayName: 'Kai' }];
      },
      getForViewer: async () => {
        throw new Error('not used');
      },
    } as unknown as PersonasService;
    const writeService = {
      write: async () => {
        throw new Error('not used');
      },
    } as unknown as WriteService;
    const growth = {
      remember: async () => {
        throw new Error('not used');
      },
    } as unknown as GrowthService;

    const factory = new McpServerFactory(personas, writeService, growth);
    const server = factory.create(actor);
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '1.0.0' });

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const listed = await client.listTools();
    expect(listed.tools.map((t) => t.name).sort()).toEqual([
      'get_persona',
      'list_personas',
      'remember',
      'write',
    ]);

    const call = await client.callTool({ name: 'list_personas', arguments: {} });
    expect(call.isError).toBeUndefined();
    expect(listOwnedCalls).toBe(1);
    const text = (call.content as { type: string; text: string }[])[0]?.text;
    expect(JSON.parse(text)).toEqual({ items: [{ id: 'p1', displayName: 'Kai' }] });

    await client.close();
    await server.close();
  });
});
