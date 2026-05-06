import { z, execLark } from './utils.js';

export const sheetsTools = [
  {
    name: 'lark_sheets_create',
    description: 'Create a spreadsheet',
    schema: {
      title: z.string().describe('Spreadsheet title'),
      folder_token: z.string().optional().describe('Parent folder token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, title, folder_token }) =>
      execLark(['sheets', 'create', '--title', title, ...(folder_token ? ['--folder', folder_token] : [])], profile),
  },
  {
    name: 'lark_sheets_read',
    description: 'Read sheet data with optional range',
    schema: {
      token: z.string().describe('Spreadsheet token'),
      range: z.string().optional().describe('Cell range (e.g. A1:C10)'),
      sheet_id: z.string().optional().describe('Sheet ID/tab name'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, range, sheet_id }) =>
      execLark(['sheets', 'read', '--token', token, ...(range ? ['--range', range] : []), ...(sheet_id ? ['--sheet', sheet_id] : [])], profile),
  },
  {
    name: 'lark_sheets_write',
    description: 'Write 2D array data to a range',
    schema: {
      token: z.string().describe('Spreadsheet token'),
      range: z.string().describe('Target range (e.g. A1:C10)'),
      data: z.string().describe('JSON 2D array of values'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, range, data }) =>
      execLark(['sheets', 'write', '--token', token, '--range', range, '--data', data], profile),
  },
  {
    name: 'lark_sheets_append',
    description: 'Append rows to a sheet',
    schema: {
      token: z.string().describe('Spreadsheet token'),
      range: z.string().optional().describe('Target range for append'),
      data: z.string().describe('JSON 2D array of values'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, range, data }) =>
      execLark(['sheets', 'append', '--token', token, '--data', data, ...(range ? ['--range', range] : [])], profile),
  },
];
