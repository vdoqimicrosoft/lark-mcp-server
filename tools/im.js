import { z, execLark } from './utils.js';

export const imTools = [
  {
    name: 'lark_im_send',
    description: 'Send a message (text/post/image/file)',
    schema: {
      chat_id: z.string().describe('Chat ID'),
      msg_type: z.enum(['text', 'post', 'image', 'file']).describe('Message type'),
      content: z.string().describe('Message content'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, chat_id, msg_type, content }) =>
      execLark(['im', 'send', '--chat', chat_id, '--type', msg_type, '--content', content], profile),
  },
  {
    name: 'lark_im_reply',
    description: 'Reply to a message',
    schema: {
      message_id: z.string().describe('Message ID to reply to'),
      content: z.string().describe('Reply content'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, message_id, content }) =>
      execLark(['im', 'reply', '--message', message_id, '--content', content], profile),
  },
  {
    name: 'lark_im_chat_create',
    description: 'Create a chat group',
    schema: {
      name: z.string().describe('Chat group name'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, name }) => execLark(['im', 'chat-create', '--name', name], profile),
  },
  {
    name: 'lark_im_chat_list',
    description: 'List chats',
    schema: {
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile }) => execLark(['im', 'chat-list'], profile),
  },
];
