import { z } from 'zod';
import { execLark } from './utils.js';

// Auth and profile tools
export const authTools = [
  {
    name: 'lark_auth_status',
    description: 'Check authentication status for the current or specified profile',
    schema: {
      profile: z.string().optional().describe('Profile name to check auth status for'),
    },
    handler: async ({ profile }) => {
      const args = ['auth', 'status', '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_auth_login',
    description: 'Initiate OAuth login flow for Lark/Feishu',
    schema: {
      profile: z.string().optional().describe('Profile name to login to'),
    },
    handler: async ({ profile }) => {
      const args = ['auth', 'login', '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_profile_list',
    description: 'List all configured profiles (multi-account support)',
    schema: {},
    handler: async () => {
      return execLark(['profile', 'list', '--format', 'json']);
    },
  },
  {
    name: 'lark_profile_create',
    description: 'Create a new profile for multi-account support',
    schema: {
      name: z.string().describe('Name for the new profile'),
      app_id: z.string().optional().describe('App ID for the profile'),
      app_secret: z.string().optional().describe('App Secret for the profile'),
    },
    handler: async ({ name, app_id, app_secret }) => {
      const args = ['profile', 'create', name, '--format', 'json'];
      if (app_id) args.push('--app-id', app_id);
      if (app_secret) args.push('--app-secret', app_secret);
      return execLark(args);
    },
  },
  {
    name: 'lark_profile_use',
    description: 'Switch the active profile',
    schema: {
      name: z.string().describe('Name of the profile to activate'),
    },
    handler: async ({ name }) => {
      return execLark(['profile', 'use', name, '--format', 'json']);
    },
  },
];
