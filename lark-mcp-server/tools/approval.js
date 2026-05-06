import { z } from 'zod';
import { execLark } from './utils.js';

// Approval tools
export const approvalTools = [
  {
    name: 'lark_approval_list',
    description: 'List pending approvals',
    schema: {
      approval_code: z.string().optional().describe('Approval definition code'),
      page_size: z.number().optional().describe('Number of results per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ approval_code, page_size, profile }) => {
      const args = ['approval', 'list', '--format', 'json'];
      if (approval_code) args.push('--approval-code', approval_code);
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_approval_approve',
    description: 'Approve an approval request',
    schema: {
      instance_id: z.string().describe('Approval instance ID'),
      comment: z.string().optional().describe('Approval comment'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ instance_id, comment, profile }) => {
      const args = ['approval', 'approve', instance_id, '--format', 'json'];
      if (comment) args.push('--comment', comment);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_approval_reject',
    description: 'Reject an approval request',
    schema: {
      instance_id: z.string().describe('Approval instance ID'),
      reason: z.string().optional().describe('Rejection reason'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ instance_id, reason, profile }) => {
      const args = ['approval', 'reject', instance_id, '--format', 'json'];
      if (reason) args.push('--reason', reason);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
