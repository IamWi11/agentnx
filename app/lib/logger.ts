type Level = "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: Level;
  route: string;
  message: string;
  [key: string]: unknown;
}

export function log(
  level: Level,
  route: string,
  message: string,
  meta?: Record<string, unknown>
) {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    route,
    message,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

// Convenience wrappers
export const logger = {
  info: (route: string, msg: string, meta?: Record<string, unknown>) =>
    log("info", route, msg, meta),
  warn: (route: string, msg: string, meta?: Record<string, unknown>) =>
    log("warn", route, msg, meta),
  error: (route: string, msg: string, meta?: Record<string, unknown>) =>
    log("error", route, msg, meta),
};
