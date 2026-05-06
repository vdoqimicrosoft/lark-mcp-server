import { z } from 'zod';
import { execLark } from './utils.js';

// Wiki tools
export const wikiTools = [
  {
    name: 'lark_wiki_list',
    description: 'List wiki spaces',
    schema: {
      page_size: z.number().optional().describe('Number of spaces per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ page_size, profile }) => {
      const args = ['wiki', 'list', '--format', 'json'];
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_wiki_search',
    description: 'Search wiki content',
    schema: {
      query: z.string().describe('Search query'),
      space_id: z.string().optional().describe('Wiki space ID to search in'),
      page_size: z.number().optional().describe('Number of results per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ query, space_id, page_size, profile }) => {
      const args = ['wiki', 'search', '--query', query, '--format', 'json'];
      if (space_id) args.push('--space-id', space_id);
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_wiki_create',
    description: 'Create a wiki page',
    schema: {
      space_id: z.string().describe('Wiki space ID'),
      title: z.string().describe('Page title'),
      content: z.string().optional().describe('Page content (markdown supported)'),
      parent_page_id: z.string().optional().describe('Parent page ID'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ space_id, title, content, parent_page_id, profile }) => {
      const args = ['wiki', 'create', '--space-id', space_id, '--title', title, '--format', 'json'];
      if (content) args.push('--content', content);
      if (parent_page_id) args.push('--parent-page-id', parent_page_id);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
