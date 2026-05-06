import { z, execLark } from './utils.js';

export const docsTools = [
  {
    name: 'lark_doc_create',
    description: 'Create a document. Optionally provide content and folder token.',
    schema: {
      title: z.string().describe('Document title'),
      content: z.string().optional().describe('Document content (markdown)'),
      folder_token: z.string().optional().describe('Parent folder token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, title, content, folder_token }) =>
      execLark(['docs', 'create', '--title', title, ...(content ? ['--content', content] : []), ...(folder_token ? ['--folder', folder_token] : [])], profile),
  },
  {
    name: 'lark_doc_read',
    description: 'Read document content by token',
    schema: {
      token: z.string().describe('Document token'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token }) => execLark(['docs', 'read', '--token', token], profile),
  },
  {
    name: 'lark_doc_update',
    description: 'Update document content',
    schema: {
      token: z.string().describe('Document token'),
      content: z.string().describe('New content (markdown)'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, token, content }) => execLark(['docs', 'update', '--token', token, '--content', content], profile),
  },
  {
    name: 'lark_doc_search',
    description: 'Search documents by query',
    schema: {
      query: z.string().describe('Search query'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, query }) => execLark(['docs', 'search', '--query', query], profile),
  },
];
