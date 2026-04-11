import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const definition = {
  name: 'fetch_external',
  description: 'Fetch data from an external URL using curl',
  input_schema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'URL to fetch data from'
      },
      format: {
        type: 'string',
        description: 'Expected format: text, json, xml',
        enum: ['text', 'json', 'xml'],
        default: 'text'
      }
    },
    required: ['url']
  }
};

export async function handler(input: Record<string, unknown>): Promise<string> {
  const { url, format = 'text' } = input;
  
  if (typeof url !== 'string') {
    return 'Error: url must be a string';
  }

  try {
    // Basic URL validation
    new URL(url);
    
    // Fetch with curl
    const { stdout, stderr } = await execAsync(`curl -s -L "${url}"`);
    
    if (stderr) {
      return `Curl error: ${stderr}`;
    }

    if (format === 'json') {
      try {
        JSON.parse(stdout);
        return stdout;
      } catch {
        return `Error: Response is not valid JSON\n${stdout}`;
      }
    }

    return stdout || 'Empty response';
    
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return `Unknown error: ${String(error)}`;
  }
}
