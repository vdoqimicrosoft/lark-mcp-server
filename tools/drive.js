import { z, execLark } from './utils.js';

export const driveTools = [
  {
    name: 'lark_drive_upload',
    description: 'Upload a file',
    schema: {
      file_path: z.string().describe('Local file path to upload'),
      folder_token: z.string().describe('Target folder token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, file_path, folder_token }) =>
      execLark(['drive', 'upload', '--file', file_path, '--folder', folder_token], profile),
  },
  {
    name: 'lark_drive_download',
    description: 'Download a file',
    schema: {
      file_token: z.string().describe('File token to download'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, file_token }) => execLark(['drive', 'download', '--token', file_token], profile),
  },
  {
    name: 'lark_drive_list',
    description: 'List files in a folder',
    schema: {
      folder_token: z.string().describe('Folder token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, folder_token }) => execLark(['drive', 'list', '--folder', folder_token], profile),
  },
  {
    name: 'lark_drive_permission',
    description: 'Set file/folder permissions',
    schema: {
      token: z.string().describe('File/folder token'),
      perm: z.enum(['view', 'edit', 'full_access', 'remove']).describe('Permission level'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, perm }) => execLark(['drive', 'permission', '--token', token, '--perm', perm], profile),
  },
];
