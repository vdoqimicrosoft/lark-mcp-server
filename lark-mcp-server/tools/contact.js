import { z, execLark } from './utils.js';

export const contactTools = [
  {
    name: 'lark_contact_search',
    description: 'Search users by name or email',
    schema: {
      query: z.string().describe('Name or email to search'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, query }) => execLark(['contact', 'search', '--query', query], profile),
  },
  {
    name: 'lark_contact_get',
    description: 'Get user info by ID',
    schema: {
      user_id: z.string().describe('User open ID'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, user_id }) => execLark(['contact', 'get', '--user', user_id], profile),
  },
];
