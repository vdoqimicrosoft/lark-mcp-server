import { z } from 'zod';
import { execLark } from './utils.js';

// Task tools
export const taskTools = [
  {
    name: 'lark_task_create',
    description: 'Create a new task',
    schema: {
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Task description'),
      due_date: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      assignee_ids: z.array(z.string()).optional().describe('Assignee user IDs'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ title, description, due_date, assignee_ids, profile }) => {
      const args = ['task', 'create', '--title', title, '--format', 'json'];
      if (description) args.push('--description', description);
      if (due_date) args.push('--due-date', due_date);
      if (assignee_ids && assignee_ids.length > 0) args.push('--assignee-ids', assignee_ids.join(','));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_task_list',
    description: 'List tasks',
    schema: {
      completed: z.boolean().optional().describe('Include completed tasks'),
      page_size: z.number().optional().describe('Number of tasks per page'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ completed, page_size, profile }) => {
      const args = ['task', 'list', '--format', 'json'];
      if (completed !== undefined) args.push('--completed', String(completed));
      if (page_size) args.push('--page-size', String(page_size));
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_task_complete',
    description: 'Mark a task as complete',
    schema: {
      task_id: z.string().describe('Task ID'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ task_id, profile }) => {
      const args = ['task', 'complete', task_id, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
