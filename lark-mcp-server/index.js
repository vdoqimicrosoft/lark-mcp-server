#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { allTools } from './tools/index.js';

// Create MCP server instance
const server = new McpServer({
  name: 'lark-mcp-server',
  version: '1.0.0',
});

// Register all tools
for (const tool of allTools) {
  server.tool(
    tool.name,
    tool.description,
    tool.schema,
    tool.handler
  );
}

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lark MCP server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
