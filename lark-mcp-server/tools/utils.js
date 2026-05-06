import { spawn } from 'child_process';

/**
 * Execute a lark-cli command and return the result
 * @param {string[]} args - Command arguments
 * @returns {Promise<{content: Array<{type: string, text: string}>>}
 */
export async function execLark(args) {
  return new Promise((resolve) => {
    const process = spawn('lark-cli', args, {
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve({
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          });
        } catch (e) {
          // If not JSON, return raw output
          resolve({
            content: [
              {
                type: 'text',
                text: stdout || 'Command executed successfully',
              },
            ],
          });
        }
      } else {
        // Handle error
        const errorMessage = stderr || stdout || `Command failed with exit code ${code}`;
        resolve({
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: true,
                message: errorMessage,
                exitCode: code,
              }, null, 2),
            },
          ],
        });
      }
    });

    process.on('error', (err) => {
      resolve({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: true,
              message: `Failed to execute lark-cli: ${err.message}. Make sure lark-cli is installed and in PATH.`,
            }, null, 2),
          },
        ],
      });
    });
  });
}
