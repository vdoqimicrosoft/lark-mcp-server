import { z } from 'zod';
import { execLark } from './utils.js';

// Calendar tools
export const calendarTools = [
  {
    name: 'lark_calendar_agenda',
    description: 'Get calendar agenda for a date range',
    schema: {
      start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
      calendar_id: z.string().optional().describe('Calendar ID'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ start_date, end_date, calendar_id, profile }) => {
      const args = ['calendar', 'agenda', '--format', 'json'];
      if (start_date) args.push('--start-date', start_date);
      if (end_date) args.push('--end-date', end_date);
      if (calendar_id) args.push('--calendar-id', calendar_id);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_calendar_create',
    description: 'Create a calendar event',
    schema: {
      summary: z.string().describe('Event summary/title'),
      start_time: z.string().describe('Start time (ISO 8601 format)'),
      end_time: z.string().describe('End time (ISO 8601 format)'),
      description: z.string().optional().describe('Event description'),
      attendees: z.array(z.string()).optional().describe('Attendee email addresses'),
      location: z.string().optional().describe('Event location'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ summary, start_time, end_time, description, attendees, location, profile }) => {
      const args = ['calendar', 'create', '--summary', summary, '--start-time', start_time, '--end-time', end_time, '--format', 'json'];
      if (description) args.push('--description', description);
      if (attendees && attendees.length > 0) args.push('--attendees', attendees.join(','));
      if (location) args.push('--location', location);
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
  {
    name: 'lark_calendar_freebusy',
    description: 'Check free/busy status for users',
    schema: {
      user_ids: z.array(z.string()).describe('User IDs to check'),
      start_time: z.string().describe('Start time (ISO 8601 format)'),
      end_time: z.string().describe('End time (ISO 8601 format)'),
      profile: z.string().optional().describe('Profile name'),
    },
    handler: async ({ user_ids, start_time, end_time, profile }) => {
      const args = ['calendar', 'freebusy', '--user-ids', user_ids.join(','), '--start-time', start_time, '--end-time', end_time, '--format', 'json'];
      if (profile) args.push('--profile', profile);
      return execLark(args);
    },
  },
];
