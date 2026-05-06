import { z } from 'zod';
import { execLark } from './utils.js';

// Document tools
export const docsTools = [
  {
    name: 'lark_doc_create',
    description: 'Create a new Lark document',
    schema: {
      title: z.string().describe('Title of the document'),
      content: z.string().optional().describe('Initial content (markdown supported)'),
      folder_token: z.string().optional().describe('Parent folder token'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ title, content, folder_token, profile }) => {
      const args = ['doc', 'create', '--title', title, '--format', 'json'];
      if (content) args.push('--content', content);
      if (folder_token) args.push('--folder-token', folder_token);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_doc_read',
    description: 'Read document content',
    schema: {
      doc_token: z.string().describe('Document token'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ doc_token, profile }) => {
      const args = ['doc', 'read', doc_token, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_doc_update',
    description: 'Update an existing document',
    schema: {
      doc_token: z.string().describe('Document token'),
      content: z.string().describe('New content (markdown supported)'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ doc_token, content, profile }) => {
      const args = ['doc', 'update', doc_token, '--content', content, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_doc_search',
    description: 'Search for documents',
    schema: {
      query: z.string().describe('Search query'),
      page_size: z.number().optional().describe('Number of results per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ query, page_size, profile }) => {
      const args = ['doc', 'search', '--query', query, '--format', 'json'];
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
