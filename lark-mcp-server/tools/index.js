import { authTools } from './auth.js';
import { docsTools } from './docs.js';
import { sheetsTools } from './sheets.js';
import { baseTools } from './base.js';
import { imTools } from './im.js';
import { calendarTools } from './calendar.js';
import { driveTools } from './drive.js';
import { taskTools } from './task.js';
import { wikiTools } from './wiki.js';
import { mailTools } from './mail.js';
import { contactTools } from './contact.js';
import { approvalTools } from './approval.js';
import { apiTools } from './api.js';

// Export all tools as a single array
export const allTools = [
  ...authTools,
  ...docsTools,
  ...sheetsTools,
  ...baseTools,
  ...imTools,
  ...calendarTools,
  ...driveTools,
  ...taskTools,
  ...wikiTools,
  ...mailTools,
  ...contactTools,
  ...approvalTools,
  ...apiTools,
];
