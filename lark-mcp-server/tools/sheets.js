import { z } from 'zod';
import { execLark } from './utils.js';

// Spreadsheet tools
export const sheetsTools = [
  {
    name: 'lark_sheets_create',
    description: 'Create a new spreadsheet',
    schema: {
      title: z.string().describe('Title of the spreadsheet'),
      folder_token: z.string().optional().describe('Parent folder token'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ title, folder_token, profile }) => {
      const args = ['sheets', 'create', '--title', title, '--format', 'json'];
      if (folder_token) args.push('--folder-token', folder_token);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_sheets_read',
    description: 'Read data from a spreadsheet',
    schema: {
      spreadsheet_token: z.string().describe('Spreadsheet token'),
      sheet_id: z.string().optional().describe('Sheet ID (uses first sheet if not specified)'),
      range: z.string().optional().describe('Range to read (e.g., "A1:C10")'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ spreadsheet_token, sheet_id, range, profile }) => {
      const args = ['sheets', 'read', spreadsheet_token, '--format', 'json'];
      if (sheet_id) args.push('--sheet-id', sheet_id);
      if (range) args.push('--range', range);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_sheets_write',
    description: 'Write data to a spreadsheet',
    schema: {
      spreadsheet_token: z.string().describe('Spreadsheet token'),
      sheet_id: z.string().optional().describe('Sheet ID'),
      range: z.string().describe('Range to write (e.g., "A1:C3")'),
      data: z.array(z.array(z.any())).describe('2D array of data to write'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ spreadsheet_token, sheet_id, range, data, profile }) => {
      const args = ['sheets', 'write', spreadsheet_token, '--range', range, '--data', JSON.stringify(data), '--format', 'json'];
      if (sheet_id) args.push('--sheet-id', sheet_id);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_sheets_append',
    description: 'Append rows to a spreadsheet',
    schema: {
      spreadsheet_token: z.string().describe('Spreadsheet token'),
      sheet_id: z.string().optional().describe('Sheet ID'),
      data: z.array(z.array(z.any())).describe('2D array of rows to append'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ spreadsheet_token, sheet_id, data, profile }) => {
      const args = ['sheets', 'append', spreadsheet_token, '--data', JSON.stringify(data), '--format', 'json'];
      if (sheet_id) args.push('--sheet-id', sheet_id);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
