export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private static devMode: boolean = false;
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

  debug(...args: any[]): void {
    if (Logger.devMode) {
      console.debug(`%c[EFI:${this.prefix}]`, "color: #9c27b0; font-weight: bold;", ...args);
    }
  }

  info(...args: any[]): void {
    console.info(`%c[EFI:${this.prefix}]`, "color: #2196f3; font-weight: bold;", ...args);
  }

  warn(...args: any[]): void {
    console.warn(`%c[EFI:${this.prefix}]`, "color: #ff9800; font-weight: bold;", ...args);
  }

  error(...args: any[]): void {
    console.error(`%c[EFI:${this.prefix}]`, "color: #f44336; font-weight: bold;", ...args);
  }
}

export default Logger;
