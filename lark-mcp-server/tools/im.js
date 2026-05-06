import { z } from 'zod';
import { execLark } from './utils.js';

// IM/Chat tools
export const imTools = [
  {
    name: 'lark_im_send',
    description: 'Send a message to a chat or user',
    schema: {
      chat_id: z.string().describe('Chat ID or user ID'),
      message: z.string().describe('Message content'),
      msg_type: z.enum(['text', 'post', 'image', 'file']).optional().default('text').describe('Message type'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ chat_id, message, msg_type, profile }) => {
      const args = ['im', 'send', chat_id, '--message', message, '--format', 'json'];
      if (msg_type) args.push('--msg-type', msg_type);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_im_reply',
    description: 'Reply to a specific message',
    schema: {
      message_id: z.string().describe('Message ID to reply to'),
      content: z.string().describe('Reply content'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ message_id, content, profile }) => {
      const args = ['im', 'reply', message_id, '--content', content, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_im_chat_create',
    description: 'Create a new chat group',
    schema: {
      name: z.string().describe('Chat group name'),
      user_ids: z.array(z.string()).optional().describe('User IDs to add'),
      description: z.string().optional().describe('Chat description'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ name, user_ids, description, profile }) => {
      const args = ['im', 'chat', 'create', '--name', name, '--format', 'json'];
      if (user_ids && user_ids.length > 0) args.push('--user-ids', user_ids.join(','));
      if (description) args.push('--description', description);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_im_chat_list',
    description: 'List chats',
    schema: {
      page_size: z.number().optional().describe('Number of chats per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ page_size, profile }) => {
      const args = ['im', 'chat', 'list', '--format', 'json'];
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
