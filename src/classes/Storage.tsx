import Logger from "./Logger";

const log = Logger.create("Storage");

class Storage {
  private static _version: string = "1.0.0";
  private static _options: StorageOptions = { prefix: "" };
  private static _cache: Map<string, any> = new Map();
  private static _cacheEnabled: boolean = true;
  private static _cacheTimeout: number = 5000;
  private static _cacheTimestamps: Map<string, number> = new Map();
  static get version(): string {
    return this._version;
  }

  static set version(value: string) {
    this._version = value;
  }

  static get options(): StorageOptions {
    return this._options;
  }

  static set options(value: StorageOptions) {
    this._options = value;
  }

  
  static config(version: string, options: StorageOptions = { prefix: "" }): void {
    this._version = version;
    this._options = options;
    log.info(`Configured v${version} with prefix: "${options.prefix}"`);
  }

  
  static setCaching(enabled: boolean, timeout: number = 5000): void {
    this._cacheEnabled = enabled;
    this._cacheTimeout = timeout;
    if (!enabled) {
      this.clearCache();
    }
    log.debug(`Caching ${enabled ? 'enabled' : 'disabled'} (timeout: ${timeout}ms)`);
  }

  
  static clearCache(): void {
    this._cache.clear();
    this._cacheTimestamps.clear();
  }

  
  private static isCacheValid(key: string): boolean {
    if (!this._cacheEnabled) return false;
    
    const timestamp = this._cacheTimestamps.get(key);
    if (!timestamp) return false;
    
    return (Date.now() - timestamp) < this._cacheTimeout;
  }

  
  private static setCache(key: string, value: any): void {
    if (!this._cacheEnabled) return;
    
    this._cache.set(key, value);
    this._cacheTimestamps.set(key, Date.now());
  }

  
  private static getCache(key: string): any | null {
    if (!this._cacheEnabled) return null;
    if (!this.isCacheValid(key)) {
      this._cache.delete(key);
      this._cacheTimestamps.delete(key);
      return null;
    }
    return this._cache.get(key);
  }

  
  private static _prefix(key: string): string {
    return this._options.prefix + key;
  }

  
  private static _unprefix(key: string): string {
    return key.substring(this._options.prefix.length);
  }

  
  private static _parse(value: any): any {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    
    return value;
  }

  
  private static _stringify(value: any): string {
    if (value === null || value === undefined) return String(value);
    
    if (typeof value === 'string') return value;
    
    try {
      return JSON.stringify(value);
    } catch (error) {
      log.error('Failed to stringify value:', error);
      return String(value);
    }
  }

  
  private static _isUndefined(value: any): boolean {
    return value === undefined;
  }

  
  private static _isType<T>(value: any, type: new (...args: any[]) => T): boolean {
    return value?.constructor === type;
  }

  
  static async read<T = any>(key: string, defaultValue?: T): Promise<T> {
    try {
      const cached = this.getCache(key);
      if (cached !== null) {
        return cached;
      }

      const prefixedKey = this._prefix(key);
      const raw = await GM.getValue(prefixedKey, defaultValue);
      const parsed = this._parse(raw);
      this.setCache(key, parsed);
      
      return parsed;
    } catch (error) {
      log.error(`Failed to read key "${key}":`, error);
      return defaultValue as T;
    }
  }

  
  static write(key: string, value: any): void {
    try {
      const prefixedKey = this._prefix(key);
      const stringified = this._stringify(value);
      
      GM.setValue(prefixedKey, stringified);
      this.setCache(key, value);
    } catch (error) {
      log.error(`Failed to write key "${key}":`, error);
      throw error;
    }
  }

  
  static delete(key: string): boolean {
    try {
      const prefixedKey = this._prefix(key);
      GM.deleteValue(prefixedKey);
      this._cache.delete(key);
      this._cacheTimestamps.delete(key);
      
      return true;
    } catch (error) {
      log.error(`Failed to delete key "${key}":`, error);
      return false;
    }
  }

  
  static async readKeys(): Promise<string[]> {
    try {
      const keys = await GM.listValues();
      return Array.isArray(keys) ? keys : [];
    } catch (error) {
      log.error('Failed to read keys:', error);
      return [];
    }
  }

  
  static async get<T = any>(key: string, defaultValue?: T): Promise<T> {
    return await this.read(key, defaultValue);
  }

  
  static async set(key: string, value: any): Promise<boolean> {
    try {
      const savedVal = await this.read(key);

      if (this._isUndefined(savedVal) || !savedVal) {
        return await this.add(key, value);
      } else {
        this.write(key, value);
        return true;
      }
    } catch (error) {
      log.error(`Failed to set key "${key}":`, error);
      return false;
    }
  }

  
  static async add(key: string, value: any): Promise<boolean> {
    try {
      const savedVal = await this.read(key, false);

      if (this._isUndefined(savedVal) || !savedVal) {
        this.write(key, value);
        return true;
      } else {
        if (Array.isArray(savedVal)) {
          const arr = savedVal as any[];
          if (!arr.includes(value)) {
            arr.push(value);
            this.write(key, arr);
            return true;
          }
          return false;
        }
        if (this._isType(savedVal, Object) && this._isType(value, Object)) {
          const merged = Object.assign({}, savedVal, value);
          this.write(key, merged);
          return true;
        }
        
        return false;
      }
    } catch (error) {
      log.error(`Failed to add key "${key}":`, error);
      return false;
    }
  }

  
  static async replace(key: string, itemFind: any, itemReplacement: any): Promise<boolean> {
    try {
      const savedVal = await this.read(key, false);

      if (this._isUndefined(savedVal) || !savedVal) {
        return false;
      }
      if (Array.isArray(savedVal)) {
        const arr = savedVal as any[];
        const index = arr.indexOf(itemFind);
        if (index !== -1) {
          arr[index] = itemReplacement;
          this.write(key, arr);
          return true;
        }
        return false;
      }
      if (this._isType(savedVal, Object) && !Array.isArray(savedVal)) {
        const obj = savedVal as unknown as Record<string, any>;
        if (itemFind in obj) {
          obj[itemFind] = itemReplacement;
          this.write(key, obj);
          return true;
        }
      }

      return false;
    } catch (error) {
      log.error(`Failed to replace in key "${key}":`, error);
      return false;
    }
  }

  
  static async remove(key: string, value?: any): Promise<boolean> {
    try {
      if (this._isUndefined(value)) {
        return this.delete(key);
      }

      const savedVal = await this.read(key);

      if (this._isUndefined(savedVal) || !savedVal) {
        return true;
      }
      if (Array.isArray(savedVal)) {
        const index = savedVal.indexOf(value);
        if (index !== -1) {
          savedVal.splice(index, 1);
          this.write(key, savedVal);
          return true;
        }
        return false;
      }
      if (this._isType(savedVal, Object) && !Array.isArray(savedVal)) {
        const obj = savedVal as unknown as Record<string, any>;
        if (value in obj) {
          delete obj[value];
          this.write(key, obj);
          return true;
        }
      }

      return false;
    } catch (error) {
      log.error(`Failed to remove from key "${key}":`, error);
      return false;
    }
  }

  
  static async getAll(): Promise<Record<string, any>> {
    try {
      const keys = await this._listKeys();
      const obj: Record<string, any> = {};

      for (const key of keys) {
        obj[key] = await this.read(key);
      }

      return obj;
    } catch (error) {
      log.error('Failed to get all:', error);
      return {};
    }
  }

  
  static async getKeys(): Promise<string[]> {
    return await this._listKeys();
  }

  
  static getPrefix(): string {
    return this._options.prefix;
  }

  
  static async empty(): Promise<void> {
    try {
      const keys = await this._listKeys();

      for (const key of keys) {
        this.delete(key);
      }

      this.clearCache();
      log.debug('All data cleared');
    } catch (error) {
      log.error('Failed to empty storage:', error);
    }
  }

  
  static async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null && value !== undefined;
    } catch (error) {
      log.error(`Failed to check key "${key}":`, error);
      return false;
    }
  }

  
  static async forEach(callback: (key: string, value: any) => void): Promise<void> {
    try {
      const allContent = await this.getAll();

      for (const key in allContent) {
        if (Object.prototype.hasOwnProperty.call(allContent, key)) {
          callback(key, allContent[key]);
        }
      }
    } catch (error) {
      log.error('Failed to iterate:', error);
    }
  }

  
  private static async _listKeys(usePrefix: boolean = false): Promise<string[]> {
    try {
      const prefixed = await this.readKeys();

      if (usePrefix) {
        return prefixed;
      }

      return prefixed
        .filter((key) => key.startsWith(this._options.prefix))
        .map((key) => this._unprefix(key));
    } catch (error) {
      log.error('Failed to list keys:', error);
      return [];
    }
  }

  
  static async setMany(entries: Record<string, any>): Promise<void> {
    try {
      for (const [key, value] of Object.entries(entries)) {
        await this.set(key, value);
      }
    } catch (error) {
      log.error('Failed to set many:', error);
      throw error;
    }
  }

  
  static async getMany<T = any>(keys: string[]): Promise<Record<string, T>> {
    const result: Record<string, T> = {};

    try {
      for (const key of keys) {
        result[key] = await this.get(key);
      }
    } catch (error) {
      log.error('Failed to get many:', error);
    }

    return result;
  }

  
  static async deleteMany(keys: string[]): Promise<void> {
    try {
      for (const key of keys) {
        await this.delete(key);
      }
    } catch (error) {
      log.error('Failed to delete many:', error);
    }
  }

  
  static async export(): Promise<StorageExport> {
    return {
      version: this._version,
      timestamp: new Date().toISOString(),
      data: await this.getAll(),
    };
  }

  
  static async import(exportData: StorageExport): Promise<void> {
    try {
      if (exportData.data) {
        await this.setMany(exportData.data);
      }
      log.debug('Import successful');
    } catch (error) {
      log.error('Import failed:', error);
      throw error;
    }
  }

  
  static async getSize(): Promise<number> {
    try {
      const allData = await this.getAll();
      const json = JSON.stringify(allData);
      return new Blob([json]).size;
    } catch (error) {
      log.error('Failed to calculate size:', error);
      return 0;
    }
  }

  
  static async getStats(): Promise<StorageStats> {
    const keys = await this.getKeys();
    const size = await this.getSize();

    return {
      totalKeys: keys.length,
      totalSize: size,
      prefix: this._options.prefix,
      version: this._version,
      cacheEnabled: this._cacheEnabled,
      cacheSize: this._cache.size,
    };
  }
}

export default Storage;
