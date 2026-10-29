import { readdirSync } from "node:fs";
import path from "node:path";

/** Walk every export of every module in data/ and collect the Unsplash photo ids it references. Node only. */
export async function collectPhotoIds(dataDir: string): Promise<string[]> {
  const ids = new Set<string>();
  const seen = new Set<unknown>();
  const visit = (value: unknown) => {
    if (typeof value === "string") {
      const match = value.match(/^https:\/\/images\.unsplash\.com\/photo-([\w-]+)$/);
      if (match) ids.add(match[1]);
      return;
    }
    if (!value || typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    for (const v of Object.values(value)) visit(v);
  };
  for (const file of readdirSync(dataDir)) {
    if (file.endsWith(".ts") && !file.endsWith(".test.ts")) visit(await import(path.join(dataDir, file)));
  }
  return [...ids].sort();
}
