type LogLevel = 'info' | 'warn' | 'error';

export function log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
  const payload = {
    level,
    message,
    ts: new Date().toISOString(),
    ...extra,
  };
  if (level === 'error') {
    console.error(JSON.stringify(payload));
    return;
  }
  if (level === 'warn') {
    console.warn(JSON.stringify(payload));
    return;
  }
  console.log(JSON.stringify(payload));
}
