import { z } from 'zod';
import { execLark } from './utils.js';

// Mail tools
export const mailTools = [
  {
    name: 'lark_mail_send',
    description: 'Send an email',
    schema: {
      to: z.array(z.string()).describe('Recipient email addresses'),
      subject: z.string().describe('Email subject'),
      body: z.string().describe('Email body content'),
      cc: z.array(z.string()).optional().describe('CC email addresses'),
      bcc: z.array(z.string()).optional().describe('BCC email addresses'),
      attachments: z.array(z.string()).optional().describe('File tokens for attachments'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ to, subject, body, cc, bcc, attachments, profile }) => {
      const args = ['mail', 'send', '--to', to.join(','), '--subject', subject, '--body', body, '--format', 'json'];
      if (cc && cc.length > 0) args.push('--cc', cc.join(','));
      if (bcc && bcc.length > 0) args.push('--bcc', bcc.join(','));
      if (attachments && attachments.length > 0) args.push('--attachments', attachments.join(','));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_mail_read',
    description: 'Read an email',
    schema: {
      mail_id: z.string().describe('Email ID'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ mail_id, profile }) => {
      const args = ['mail', 'read', mail_id, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_mail_search',
    description: 'Search emails',
    schema: {
      query: z.string().describe('Search query'),
      folder: z.string().optional().describe('Mail folder (inbox, sent, drafts, etc.)'),
      page_size: z.number().optional().describe('Number of results per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ query, folder, page_size, profile }) => {
      const args = ['mail', 'search', '--query', query, '--format', 'json'];
      if (folder) args.push('--folder', folder);
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
