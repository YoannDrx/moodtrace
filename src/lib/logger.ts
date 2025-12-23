/**
 * Simple logger utility
 * Using console with structured output for simplicity
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel =
  process.env.NODE_ENV === "production" ? LOG_LEVELS.info : LOG_LEVELS.debug;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= minLevel;
}

function formatMessage(level: LogLevel, message: string, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  return { prefix, message, args };
}

export const logger = {
  debug(message: string, ...args: unknown[]) {
    if (shouldLog("debug")) {
      const { prefix, message: msg, args: a } = formatMessage(
        "debug",
        message,
        ...args,
      );
      console.debug(prefix, msg, ...a);
    }
  },

  info(message: string, ...args: unknown[]) {
    if (shouldLog("info")) {
      const { prefix, message: msg, args: a } = formatMessage(
        "info",
        message,
        ...args,
      );
      console.info(prefix, msg, ...a);
    }
  },

  warn(message: string, ...args: unknown[]) {
    if (shouldLog("warn")) {
      const { prefix, message: msg, args: a } = formatMessage(
        "warn",
        message,
        ...args,
      );
      console.warn(prefix, msg, ...a);
    }
  },

  error(message: string, ...args: unknown[]) {
    if (shouldLog("error")) {
      const { prefix, message: msg, args: a } = formatMessage(
        "error",
        message,
        ...args,
      );
      console.error(prefix, msg, ...a);
    }
  },
};
