type LogMeta = Record<string, unknown> | string | number | boolean | null | undefined;

function format(level: string, message: string, meta?: LogMeta) {
  const timestamp = new Date().toISOString();
  if (meta === undefined) {
    return `${timestamp} [${level}] ${message}`;
  }
  return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(format("INFO", message, meta));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(format("WARN", message, meta));
  },
  error(message: string, meta?: LogMeta) {
    console.error(format("ERROR", message, meta));
  },
};
