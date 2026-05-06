#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { allTools } from './tools/index.js';

const server = new McpServer({
  name: 'lark-mcp-server',
  version: '2.0.0',
});

for (const tool of allTools) {
  server.tool(
    tool.name,
    tool.description,
    tool.schema,
    tool.handler
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lark MCP server v2.0 started (multi-bot support)');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
