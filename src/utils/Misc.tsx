export function getObjectFromPath(path: string, safe: boolean = false): any {
  if (typeof path !== "string") {
    return path;
  }
  const parts: any = path.split(".");
  let obj = unsafeWindow;
  for (let part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      if (safe) {
        return null;
      }
      throw new Error(`Path ${path} does not exist`);
    }
  }
  return obj;
}

export function formatLabel(name: string): string {
  if (!name) return '';
  // replace underscores/hyphens with spaces
  let s = String(name).replace(/[_-]+/g, ' ');
  // separate camelCase / PascalCase
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  // title case each word
  s = s.split(' ').map((w) => w.length ? (w.charAt(0).toUpperCase() + w.slice(1)) : '').join(' ');
  return s.trim();
}
