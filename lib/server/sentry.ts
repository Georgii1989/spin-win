import { log } from './logger';

export function captureServerError(error: unknown, context?: Record<string, unknown>): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  log('error', 'server_error', { error: errorMessage, ...context });
}
