import { z, execLark } from './utils.js';

export const mailTools = [
  {
    name: 'lark_mail_send',
    description: 'Send an email with optional cc, bcc',
    schema: {
      to: z.string().describe('Recipient email'),
      subject: z.string().describe('Email subject'),
      body: z.string().describe('Email body'),
      cc: z.string().optional().describe('CC recipients (comma-separated)'),
      bcc: z.string().optional().describe('BCC recipients (comma-separated)'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, to, subject, body, cc, bcc }) =>
      execLark(['mail', 'send', '--to', to, '--subject', subject, '--body', body, ...(cc ? ['--cc', cc] : []), ...(bcc ? ['--bcc', bcc] : [])], profile),
  },
  {
    name: 'lark_mail_read',
    description: 'Read an email',
    schema: {
      message_id: z.string().describe('Email message ID'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, message_id }) => execLark(['mail', 'read', '--message', message_id], profile),
  },
  {
    name: 'lark_mail_search',
    description: 'Search emails by folder/query',
    schema: {
      query: z.string().describe('Search query'),
      folder: z.string().optional().describe('Folder name'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, query, folder }) =>
      execLark(['mail', 'search', '--query', query, ...(folder ? ['--folder', folder] : [])], profile),
  },
];
