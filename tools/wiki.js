import { z, execLark } from './utils.js';

export const wikiTools = [
  {
    name: 'lark_wiki_list',
    description: 'List wiki spaces',
    schema: {
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile }) => execLark(['wiki', 'list'], profile),
  },
  {
    name: 'lark_wiki_search',
    description: 'Search wiki content',
    schema: {
      query: z.string().describe('Search query'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, query }) => execLark(['wiki', 'search', '--query', query], profile),
  },
  {
    name: 'lark_wiki_create',
    description: 'Create a wiki page with markdown content',
    schema: {
      parent: z.string().describe('Parent node token'),
      title: z.string().describe('Page title'),
      content: z.string().describe('Page content (markdown)'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, parent, title, content }) =>
      execLark(['wiki', 'create', '--parent', parent, '--title', title, '--content', content], profile),
  },
];
