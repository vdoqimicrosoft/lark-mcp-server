import { z, execLark } from './utils.js';

export const baseTools = [
  {
    name: 'lark_base_create',
    description: 'Create a bitable/base',
    schema: {
      name: z.string().describe('Base name'),
      folder_token: z.string().optional().describe('Parent folder token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, name, folder_token }) =>
      execLark(['base', 'create', '--name', name, ...(folder_token ? ['--folder', folder_token] : [])], profile),
  },
  {
    name: 'lark_base_list_tables',
    description: 'List tables in a base',
    schema: {
      token: z.string().describe('Base token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token }) => execLark(['base', 'tables', '--token', token], profile),
  },
  {
    name: 'lark_base_record_create',
    description: 'Create a record with key-value fields',
    schema: {
      token: z.string().describe('Base token'),
      table: z.string().describe('Table ID'),
      fields: z.string().describe('JSON object of field values'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, table, fields }) =>
      execLark(['base', 'record-create', '--token', token, '--table', table, '--fields', fields], profile),
  },
  {
    name: 'lark_base_record_read',
    description: 'Read records with optional filter',
    schema: {
      token: z.string().describe('Base token'),
      table: z.string().describe('Table ID'),
      filter: z.string().optional().describe('Filter expression'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, table, filter }) =>
      execLark(['base', 'record-read', '--token', token, '--table', table, ...(filter ? ['--filter', filter] : [])], profile),
  },
  {
    name: 'lark_base_record_update',
    description: 'Update a record',
    schema: {
      token: z.string().describe('Base token'),
      table: z.string().describe('Table ID'),
      record_id: z.string().describe('Record ID'),
      fields: z.string().describe('JSON object of field values'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, table, record_id, fields }) =>
      execLark(['base', 'record-update', '--token', token, '--table', table, '--record', record_id, '--fields', fields], profile),
  },
];
