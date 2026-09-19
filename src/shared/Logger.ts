export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  timestamp: number;
  timeStr: string;
  level: LogLevel;
  tag: string;
  message: string;
}

export type LogListener = (entry: LogEntry) => void;

export class Logger {
  private static devMode: boolean = false;
  private static listeners: Set<LogListener> = new Set();
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  static create(prefix: string): Logger {
    return new Logger(prefix);
  }

  static setDevMode(enabled: boolean): void {
    this.devMode = enabled;
  }

  static isDevMode(): boolean {
    return this.devMode;
  }

  static addListener(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static dispatch(level: LogLevel, tag: string, args: any[]): void {
    if (this.listeners.size === 0) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
    const message = args
      .map((a) => {
        if (a instanceof Error) return `${a.message} \n${a.stack || ""}`;
        if (typeof a === "object" && a !== null) {
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        }
        return String(a);
      })
      .join(" ");

    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: now.getTime(),
      timeStr,
      level,
      tag,
      message,
    };

    for (const listener of this.listeners) {
      try {
        listener(entry);
      } catch {
        // Prevent recursive logging issues
      }
    }
  }

  debug(...args: any[]): void {
    if (Logger.devMode) {
      console.debug(`%c[EFI:${this.prefix}]`, "color: #9c27b0; font-weight: bold;", ...args);
      Logger.dispatch("debug", this.prefix, args);
    }
  }

  info(...args: any[]): void {
    console.info(`%c[EFI:${this.prefix}]`, "color: #2196f3; font-weight: bold;", ...args);
    Logger.dispatch("info", this.prefix, args);
  }

  warn(...args: any[]): void {
    console.warn(`%c[EFI:${this.prefix}]`, "color: #ff9800; font-weight: bold;", ...args);
    Logger.dispatch("warn", this.prefix, args);
  }

  error(...args: any[]): void {
    console.error(`%c[EFI:${this.prefix}]`, "color: #f44336; font-weight: bold;", ...args);
    Logger.dispatch("error", this.prefix, args);
  }
}

export default Logger;
