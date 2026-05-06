import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { z } from 'zod';

const execFileAsync = promisify(execFile);

export { z };

export function execLark(args, profile) {
  const finalArgs = [...args];
  if (profile) {
    finalArgs.push('--profile', profile);
  }
  return execFileAsync('lark-cli', finalArgs, { timeout: 30000 })
    .then(({ stdout }) => {
      try {
        const json = JSON.parse(stdout);
        return { content: [{ type: 'text', text: JSON.stringify(json, null, 2) }] };
      } catch {
        return { content: [{ type: 'text', text: stdout }] };
      }
    })
    .catch((e) => {
      const msg = e.stderr || e.message;
      return { content: [{ type: 'text', text: msg }], isError: true };
    });
}
