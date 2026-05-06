import { z } from 'zod';
import { execLark } from './utils.js';

// Raw API tool
export const apiTools = [
  {
    name: 'lark_api_call',
    description: 'Call any Lark API endpoint directly (for advanced use cases)',
    schema: {
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).describe('HTTP method'),
      path: z.string().describe('API path (e.g., /open-api/bitable/v1/apps)'),
      body: z.record(z.any()).optional().describe('Request body (for POST/PUT)'),
      query: z.record(z.string()).optional().describe('Query parameters'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ method, path, body, query, profile }) => {
      const args = ['api', 'call', '--method', method, '--path', path, '--format', 'json'];
      if (body) args.push('--body', JSON.stringify(body));
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          args.push('--query', `${key}=${value}`);
        }
      }
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
