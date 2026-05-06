import { z, execLark } from './utils.js';

export const taskTools = [
  {
    name: 'lark_task_create',
    description: 'Create a task with optional due date and assignees',
    schema: {
      summary: z.string().describe('Task title'),
      due: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      assignees: z.string().optional().describe('Comma-separated assignee IDs'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, summary, due, assignees }) =>
      execLark(['task', 'create', '--summary', summary, ...(due ? ['--due', due] : []), ...(assignees ? ['--assignees', assignees] : [])], profile),
  },
  {
    name: 'lark_task_list',
    description: 'List tasks',
    schema: {
      completed: z.boolean().optional().describe('Include completed tasks'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, completed }) =>
      execLark(['task', 'list', ...(completed !== undefined ? ['--completed', String(completed)] : [])], profile),
  },
  {
    name: 'lark_task_complete',
    description: 'Mark a task complete',
    schema: {
      task_id: z.string().describe('Task ID'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, task_id }) => execLark(['task', 'complete', '--task', task_id], profile),
  },
];
