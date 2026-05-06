import { z } from 'zod';
import { execLark } from './utils.js';

// Contact tools
export const contactTools = [
  {
    name: 'lark_contact_search',
    description: 'Search for users',
    schema: {
      query: z.string().describe('Search query (name, email, etc.)'),
      page_size: z.number().optional().describe('Number of results per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ query, page_size, profile }) => {
      const args = ['contact', 'search', '--query', query, '--format', 'json'];
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_contact_get',
    description: 'Get user information',
    schema: {
      user_id: z.string().describe('User ID'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ user_id, profile }) => {
      const args = ['contact', 'get', user_id, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
