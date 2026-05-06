import { z } from 'zod';
import { execLark } from './utils.js';

// Base (bitable) tools
export const baseTools = [
  {
    name: 'lark_base_create',
    description: 'Create a new base (bitable)',
    schema: {
      name: z.string().describe('Name of the base'),
      folder_token: z.string().optional().describe('Parent folder token'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ name, folder_token, profile }) => {
      const args = ['base', 'create', '--name', name, '--format', 'json'];
      if (folder_token) args.push('--folder-token', folder_token);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_base_list_tables',
    description: 'List all tables in a base',
    schema: {
      app_token: z.string().describe('Base app token'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ app_token, profile }) => {
      const args = ['base', 'list-tables', app_token, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_base_record_create',
    description: 'Create a new record in a base table',
    schema: {
      app_token: z.string().describe('Base app token'),
      table_id: z.string().describe('Table ID'),
      fields: z.record(z.any()).describe('Field values as key-value pairs'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ app_token, table_id, fields, profile }) => {
      const args = ['base', 'record', 'create', app_token, table_id, '--fields', JSON.stringify(fields), '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_base_record_read',
    description: 'Read records from a base table',
    schema: {
      app_token: z.string().describe('Base app token'),
      table_id: z.string().describe('Table ID'),
      record_id: z.string().optional().describe('Specific record ID'),
      filter: z.string().optional().describe('Filter condition'),
      page_size: z.number().optional().describe('Number of records per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ app_token, table_id, record_id, filter, page_size, profile }) => {
      const args = ['base', 'record', 'read', app_token, table_id, '--format', 'json'];
      if (record_id) args.push('--record-id', record_id);
      if (filter) args.push('--filter', filter);
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_base_record_update',
    description: 'Update a record in a base table',
    schema: {
      app_token: z.string().describe('Base app token'),
      table_id: z.string().describe('Table ID'),
      record_id: z.string().describe('Record ID to update'),
      fields: z.record(z.any()).describe('Field values to update'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ app_token, table_id, record_id, fields, profile }) => {
      const args = ['base', 'record', 'update', app_token, table_id, record_id, '--fields', JSON.stringify(fields), '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
