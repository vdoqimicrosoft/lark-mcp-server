import { z } from 'zod';
import { execLark } from './utils.js';

// Drive tools
export const driveTools = [
  {
    name: 'lark_drive_upload',
    description: 'Upload a file to Lark Drive',
    schema: {
      file_path: z.string().describe('Local file path to upload'),
      folder_token: z.string().optional().describe('Target folder token'),
      name: z.string().optional().describe('Custom file name'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ file_path, folder_token, name, profile }) => {
      const args = ['drive', 'upload', file_path, '--format', 'json'];
      if (folder_token) args.push('--folder-token', folder_token);
      if (name) args.push('--name', name);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_drive_download',
    description: 'Download a file from Lark Drive',
    schema: {
      file_token: z.string().describe('File token to download'),
      local_path: z.string().optional().describe('Local path to save file'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ file_token, local_path, profile }) => {
      const args = ['drive', 'download', file_token, '--format', 'json'];
      if (local_path) args.push('--local-path', local_path);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_drive_list',
    description: 'List files in a folder',
    schema: {
      folder_token: z.string().optional().describe('Folder token (root if not specified)'),
      page_size: z.number().optional().describe('Number of files per page'),
      file_type: z.string().optional().describe('Filter by file type'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ folder_token, page_size, file_type, profile }) => {
      const args = ['drive', 'list', '--format', 'json'];
      if (folder_token) args.push('--folder-token', folder_token);
      if (page_size) args.push('--page-size', String(page_size));
      if (file_type) args.push('--file-type', file_type);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_drive_permission',
    description: 'Set file or folder permissions',
    schema: {
      token: z.string().describe('File or folder token'),
      permission: z.enum(['view', 'edit', 'full_access', 'remove']).describe('Permission level'),
      user_id: z.string().optional().describe('User ID to grant permission'),
      department_id: z.string().optional().describe('Department ID to grant permission'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ token, permission, user_id, department_id, profile }) => {
      const args = ['drive', 'permission', token, '--permission', permission, '--format', 'json'];
      if (user_id) args.push('--user-id', user_id);
      if (department_id) args.push('--department-id', department_id);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
