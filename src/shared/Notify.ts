import { toast } from "solid-sonner";
import Logger from "./Logger";

const log = Logger.create("Notify");

export type NotificationType = "success" | "error" | "info" | "warning";

export class Notify {
  static success(message: string, title?: string): void {
    log.info(`[SUCCESS] ${title ? title + ": " : ""}${message.replace(/<[^>]*>?/gm, "")}`);
    toast.success(title || "Success", {
      description: message,
    });
  }

  static error(message: string, title?: string): void {
    log.error(`[ERROR] ${title ? title + ": " : ""}${message.replace(/<[^>]*>?/gm, "")}`);
    toast.error(title || "Error", {
      description: message,
    });
  }

  static info(message: string, title?: string): void {
    log.info(`[INFO] ${title ? title + ": " : ""}${message.replace(/<[^>]*>?/gm, "")}`);
    toast.info(title || "Info", {
      description: message,
    });
  }

  static warning(message: string, title?: string): void {
    log.warn(`[WARNING] ${title ? title + ": " : ""}${message.replace(/<[^>]*>?/gm, "")}`);
    toast.warning(title || "Warning", {
      description: message,
    });
  }

  static successNow(message: string): void {
    this.success(message);
  }

  static errorNow(message: string): void {
    this.error(message);
  }

  static infoNow(message: string): void {
    this.info(message);
  }

  static warningNow(message: string): void {
    this.warning(message);
  }

  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: (data: T) => string;
      error: (err: any) => string;
    }
  ): Promise<T> {
    return toast.promise(promise, messages) as unknown as Promise<T>;
  }
}

export default Notify;
