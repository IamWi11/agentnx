import fs from "fs";
import path from "path";

type Level = "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: Level | "audit";
  route: string;
  message: string;
  userId?: string;
  [key: string]: unknown;
}

const LOGS_DIR = path.join(process.cwd(), "logs");
const AUDIT_LOG = path.join(LOGS_DIR, "audit.jsonl");

function ensureLogsDir() {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

function writeAudit(entry: LogEntry) {
  try {
    ensureLogsDir();
    fs.appendFileSync(AUDIT_LOG, JSON.stringify(entry) + "\n", { encoding: "utf8" });
  } catch (err) {
    // Never let audit write failure crash the request — log to stderr
    console.error("[audit-write-failure]", err);
  }
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

interface Logger {
  info: (route: string, msg: string, meta?: Record<string, unknown>) => void;
  warn: (route: string, msg: string, meta?: Record<string, unknown>) => void;
  error: (route: string, msg: string, meta?: Record<string, unknown>) => void;
  audit: (route: string, action: string, userId: string, meta?: Record<string, unknown>) => void;
}

export const logger: Logger = {
  info: (route, msg, meta) => log("info", route, msg, meta),
  warn: (route, msg, meta) => log("warn", route, msg, meta),
  error: (route, msg, meta) => log("error", route, msg, meta),
  audit: (route, action, userId, meta) => {
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level: "audit",
      route,
      message: action,
      userId,
      audit: true,
      ...meta,
    };
    // Write to stdout so server logs capture it
    console.log(JSON.stringify(entry));
    // Write to persistent append-only JSONL file for ALCOA compliance
    writeAudit(entry);
  },
};
