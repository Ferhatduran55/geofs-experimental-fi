import { toast } from "solid-sonner";
import toastOptions from "../assets/json/ServicesToastOptions";

class Notify {
  private static pendingNotifications: Map<string, NotificationItem[]> = new Map();
  private static timeoutIds: Map<string, number> = new Map();
  private static batchDelay: number = 500;
  private static maxBatchSize: number = 10;
  private static maxDisplayItems: number = 5;

  
  static configure(options: NotifyConfig): void {
    if (options.batchDelay !== undefined) {
      this.batchDelay = options.batchDelay;
    }
    if (options.maxBatchSize !== undefined) {
      this.maxBatchSize = options.maxBatchSize;
    }
    if (options.maxDisplayItems !== undefined) {
      this.maxDisplayItems = options.maxDisplayItems;
    }
  }

  
  static loading(message: string): string | number {
    return toast.loading(message, { ...toastOptions, duration: Infinity });
  }

  
  static dismiss(toastId: string | number): void {
    toast.dismiss(toastId);
  }

  
  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    }
  ): Promise<T> {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...toastOptions,
    });
    return promise;
  }

  
  static success(message: string, category: string = "default"): void {
    this.queue("success", message, category);
  }

  
  static error(message: string, category: string = "default"): void {
    this.queue("error", message, category);
  }

  
  static info(message: string, category: string = "default"): void {
    this.queue("info", message, category);
  }

  
  static warning(message: string, category: string = "default"): void {
    this.queue("warning", message, category);
  }

  
  static immediate(type: NotificationType, message: string): void {
    this.showToast(type, message);
  }

  
  static successNow(message: string): void {
    this.showToast("success", message);
  }

  
  static errorNow(message: string): void {
    this.showToast("error", message);
  }

  
  static infoNow(message: string): void {
    this.showToast("info", message);
  }

  
  static warningNow(message: string): void {
    this.showToast("warning", message);
  }

  
  private static queue(type: NotificationType, message: string, category: string): void {
    const key = `${category}_${type}`;
    if (!this.pendingNotifications.has(key)) {
      this.pendingNotifications.set(key, []);
    }
    
    const notifications = this.pendingNotifications.get(key)!;
    notifications.push({ type, message, timestamp: Date.now() });
    if (notifications.length >= this.maxBatchSize) {
      this.flush(key);
      return;
    }
    if (this.timeoutIds.has(key)) {
      clearTimeout(this.timeoutIds.get(key));
    }
    const timeoutId = window.setTimeout(() => {
      this.flush(key);
    }, this.batchDelay);
    
    this.timeoutIds.set(key, timeoutId);
  }

  
  private static flush(key: string): void {
    const notifications = this.pendingNotifications.get(key);
    if (!notifications || notifications.length === 0) return;
    if (this.timeoutIds.has(key)) {
      clearTimeout(this.timeoutIds.get(key));
      this.timeoutIds.delete(key);
    }
    const type = notifications[0].type;
    const message = this.buildBatchedMessage(notifications);
    this.showToast(type, message);
    this.pendingNotifications.set(key, []);
  }

  
  private static parseMessage(message: string): { property: string; value: string } | null {
    const setToMatch = message.match(/^(\w+)\s+(?:set|reset)\s+to\s+(.+)$/i);
    if (setToMatch) {
      return { property: setToMatch[1], value: setToMatch[2] };
    }
    const colonMatch = message.match(/^(\w+):\s*(.+)$/);
    if (colonMatch) {
      return { property: colonMatch[1], value: colonMatch[2] };
    }

    return null;
  }

  
  private static buildBatchedMessage(notifications: NotificationItem[]): string {
    if (notifications.length === 1) {
      return notifications[0].message;
    }
    const propertyChanges = new Map<string, { 
      firstValue: string; 
      lastValue: string; 
      count: number;
      unparsedMessages: string[];
    }>();
    
    const unparsedMessages: string[] = [];

    for (const n of notifications) {
      const parsed = this.parseMessage(n.message);
      
      if (parsed) {
        const existing = propertyChanges.get(parsed.property);
        if (existing) {
          existing.lastValue = parsed.value;
          existing.count++;
        } else {
          propertyChanges.set(parsed.property, {
            firstValue: parsed.value,
            lastValue: parsed.value,
            count: 1,
            unparsedMessages: []
          });
        }
      } else {
        unparsedMessages.push(n.message);
      }
    }
    const parts: string[] = [];
    let itemCount = 0;
    propertyChanges.forEach((data, property) => {
      if (itemCount >= this.maxDisplayItems) return;
      
      if (data.count === 1) {
        parts.push(`${property}: ${data.lastValue}`);
      } else if (data.firstValue === data.lastValue) {
        parts.push(`${property}: ${data.lastValue} (×${data.count})`);
      } else {
        parts.push(`${property}: ${data.firstValue} → ${data.lastValue} (×${data.count})`);
      }
      itemCount++;
    });
    const unparsedCounts = new Map<string, number>();
    for (const msg of unparsedMessages) {
      unparsedCounts.set(msg, (unparsedCounts.get(msg) || 0) + 1);
    }

    unparsedCounts.forEach((count, message) => {
      if (itemCount >= this.maxDisplayItems) return;
      parts.push(count > 1 ? `${message} (×${count})` : message);
      itemCount++;
    });
    const totalItems = propertyChanges.size + unparsedCounts.size;
    const remainingCount = totalItems - this.maxDisplayItems;
    if (remainingCount > 0) {
      parts.push(`+${remainingCount} more`);
    }

    return parts.join(" • ");
  }

  
  private static showToast(type: NotificationType, message: string): void {
    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      case "warning":
        toast.warning(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  }

  
  static flushAll(): void {
    this.pendingNotifications.forEach((_, key) => {
      this.flush(key);
    });
  }

  
  static clearAll(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds.clear();
    this.pendingNotifications.clear();
  }

  
  static getPendingCount(): number {
    let count = 0;
    this.pendingNotifications.forEach((notifications) => {
      count += notifications.length;
    });
    return count;
  }
}

export default Notify;
