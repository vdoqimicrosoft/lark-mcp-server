import { z, execLark } from './utils.js';

export const calendarTools = [
  {
    name: 'lark_calendar_agenda',
    description: 'Get agenda for a date range',
    schema: {
      start: z.string().describe('Start date (YYYY-MM-DD)'),
      end: z.string().describe('End date (YYYY-MM-DD)'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, start, end }) => execLark(['calendar', 'agenda', '--start', start, '--end', end], profile),
  },
  {
    name: 'lark_calendar_create',
    description: 'Create a calendar event with attendees and location',
    schema: {
      summary: z.string().describe('Event title'),
      start_time: z.string().describe('Start time (ISO 8601)'),
      end_time: z.string().describe('End time (ISO 8601)'),
      attendees: z.string().optional().describe('Comma-separated attendee user IDs'),
      location: z.string().optional().describe('Event location'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, summary, start_time, end_time, attendees, location }) =>
      execLark(['calendar', 'create', '--summary', summary, '--start', start_time, '--end', end_time, ...(attendees ? ['--attendees', attendees] : []), ...(location ? ['--location', location] : [])], profile),
  },
  {
    name: 'lark_calendar_freebusy',
    description: 'Check free/busy status',
    schema: {
      start: z.string().describe('Start time (ISO 8601)'),
      end: z.string().describe('End time (ISO 8601)'),
      profile: z.string().optional().describe('Profile name (bot identity)'),
    },
    handler: async ({ profile, start, end }) => execLark(['calendar', 'freebusy', '--start', start, '--end', end], profile),
  },
];
