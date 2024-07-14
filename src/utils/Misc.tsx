export function getObjectFromPath(path: string): any {
  const parts: any = path.split(".");
  let obj = unsafeWindow;
  for (let part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error(`Path ${path} does not exist`);
    }
  }
  return obj;
}
