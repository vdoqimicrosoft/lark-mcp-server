import { z, execLark } from './utils.js';

export const approvalTools = [
  {
    name: 'lark_approval_list',
    description: 'List pending approvals',
    schema: {
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile }) => execLark(['approval', 'list'], profile),
  },
  {
    name: 'lark_approval_approve',
    description: 'Approve a request',
    schema: {
      approval_id: z.string().describe('Approval code'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, approval_id }) => execLark(['approval', 'approve', '--code', approval_id], profile),
  },
  {
    name: 'lark_approval_reject',
    description: 'Reject a request',
    schema: {
      approval_id: z.string().describe('Approval code'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, approval_id }) => execLark(['approval', 'reject', '--code', approval_id], profile),
  },
];
