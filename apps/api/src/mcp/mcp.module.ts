import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module.js';
import { PersonasModule } from '../personas/personas.module.js';
import { WriteModule } from '../write/write.module.js';
import { GrowthModule } from '../growth/growth.module.js';
import { McpController } from './mcp.controller.js';
import { McpServerFactory } from './mcp.server.factory.js';

@Module({
  imports: [ApiKeysModule, PersonasModule, WriteModule, GrowthModule],
  controllers: [McpController],
  providers: [McpServerFactory],
})
export class McpModule {}
