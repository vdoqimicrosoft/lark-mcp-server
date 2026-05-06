import { z, execLark } from './utils.js';

export const apiTools = [
  {
    name: 'lark_api_call',
    description: 'Call any Lark API endpoint directly',
    schema: {
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTP method'),
      path: z.string().describe('API path (e.g. /open-apis/im/v1/messages)'),
      body: z.string().optional().describe('JSON body for POST/PUT'),
      query: z.string().optional().describe('Query parameters as JSON'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, method, path, body, query }) =>
      execLark(['api', 'call', '--method', method, '--path', path, ...(body ? ['--body', body] : []), ...(query ? ['--query', query] : [])], profile),
  },
];
