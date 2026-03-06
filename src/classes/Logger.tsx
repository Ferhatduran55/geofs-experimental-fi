const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_STYLES: Record<LogLevel, string> = {
  debug: "color: #888; font-style: italic;",
  info: "color: #2196F3;",
  warn: "color: #FF9800; font-weight: bold;",
  error: "color: #F44336; font-weight: bold;",
};

class Logger {
  private static _config: LoggerConfig = {
    enabled: true,
    minLevel: "info",
    prefix: "EFI",
    showTimestamp: false,
    devMode: false,
  };

  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  
  static configure(config: Partial<LoggerConfig>): void {
    Logger._config = { ...Logger._config, ...config };
    if (config.devMode) {
      Logger._config.minLevel = "debug";
    }
  }

  
  static setDevMode(enabled: boolean): void {
    Logger._config.devMode = enabled;
    Logger._config.minLevel = enabled ? "debug" : "info";
  }

  
  static isDevMode(): boolean {
    return Logger._config.devMode;
  }

  
  static create(module: string): Logger {
    return new Logger(module);
  }

  
  private shouldLog(level: LogLevel): boolean {
    if (!Logger._config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[Logger._config.minLevel];
  }

  
  private formatPrefix(_level: LogLevel): string {
    const parts: string[] = [];
    
    if (Logger._config.showTimestamp) {
      parts.push(new Date().toISOString().substr(11, 12));
    }
    
    parts.push(`[${Logger._config.prefix}]`);
    parts.push(`[${this.module}]`);
    
    return parts.join(" ");
  }

  
  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog("debug")) return;
    console.log(`%c${this.formatPrefix("debug")} ${message}`, LOG_STYLES.debug, ...args);
  }

  
  info(message: string, ...args: any[]): void {
    if (!this.shouldLog("info")) return;
    console.log(`%c${this.formatPrefix("info")} ${message}`, LOG_STYLES.info, ...args);
  }

  
  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog("warn")) return;
    console.warn(`%c${this.formatPrefix("warn")} ${message}`, LOG_STYLES.warn, ...args);
  }

  
  error(message: string, ...args: any[]): void {
    if (!this.shouldLog("error")) return;
    console.error(`%c${this.formatPrefix("error")} ${message}`, LOG_STYLES.error, ...args);
  }

  
  log(level: LogLevel, message: string, ...args: any[]): void {
    switch (level) {
      case "debug":
        this.debug(message, ...args);
        break;
      case "info":
        this.info(message, ...args);
        break;
      case "warn":
        this.warn(message, ...args);
        break;
      case "error":
        this.error(message, ...args);
        break;
    }
  }

  
  group(label: string, collapsed: boolean = true): void {
    if (!Logger._config.enabled) return;
    const method = collapsed ? console.groupCollapsed : console.group;
    method(`${this.formatPrefix("info")} ${label}`);
  }

  
  groupEnd(): void {
    if (!Logger._config.enabled) return;
    console.groupEnd();
  }

  
  time(label: string): void {
    if (!Logger._config.enabled) return;
    console.time(`${this.formatPrefix("debug")} ${label}`);
  }

  
  timeEnd(label: string): void {
    if (!Logger._config.enabled) return;
    console.timeEnd(`${this.formatPrefix("debug")} ${label}`);
  }

  
  table(data: any): void {
    if (!Logger._config.enabled) return;
    console.log(`${this.formatPrefix("info")} Table:`);
    console.table(data);
  }
}

export default Logger;
