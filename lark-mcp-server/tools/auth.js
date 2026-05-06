import { z, execLark } from './utils.js';

export const authTools = [
  {
    name: 'lark_auth_status',
    description: 'Check authentication status for a profile',
    schema: { profile: z.string().optional().describe('Profile name (bot identity)') },
    handler: async ({ profile }) => execLark(['auth', 'status'], profile),
  },
  {
    name: 'lark_auth_login',
    description: 'Initiate OAuth login for a profile',
    schema: { profile: z.string().optional().describe('Profile name') },
    handler: async ({ profile }) => execLark(['auth', 'login'], profile),
  },
  {
    name: 'lark_profile_list',
    description: 'List all configured profiles',
    schema: {},
    handler: async () => execLark(['profile', 'list']),
  },
  {
    name: 'lark_profile_create',
    description: 'Create a new profile (multi-bot). Provide app_id and app_secret.',
    schema: {
      name: z.string().describe('Profile name'),
      app_id: z.string().describe('App ID'),
      app_secret: z.string().describe('App Secret'),
      brand: z.enum(['feishu', 'lark']).optional().describe('Brand (feishu or lark)'),
    },
    handler: async ({ name, app_id, app_secret, brand }) =>
      execLark(['config', 'init', '--name', name, '--app-id', app_id, '--app-secret', app_secret, ...(brand ? ['--brand', brand] : [])]),
  },
  {
    name: 'lark_profile_use',
    description: 'Switch active profile',
    schema: { name: z.string().describe('Profile name to activate') },
    handler: async ({ name }) => execLark(['profile', 'use', name]),
  },
];
