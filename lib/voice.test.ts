import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Words Gustav doesn't use. "Viking" is allowed only in real place or ship names, so it is checked as decoration elsewhere. */
const BANNED = [/fairy\s?tale/i, /magical/i, /breathtaking/i, /winter wonderland/i, /\bhygge\b/i, /\bvikings?\b/i, /stunning/i, /once-in-a-lifetime/i];

const ROOTS = ["data", "content", "components", "app"];

function files(dir: string): string[] {
  try {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : /\.(tsx?|mdx?)$/.test(name) && !name.endsWith(".test.ts") ? [path] : [];
    });
  } catch {
    return [];
  }
}

describe("brand voice", () => {
  it("avoids banned words in copy", () => {
    const hits: string[] = [];
    for (const file of ROOTS.flatMap(files)) {
      const text = readFileSync(file, "utf8");
      for (const word of BANNED) {
        const match = text.match(word);
        if (match) hits.push(`${file}: "${match[0]}"`);
      }
    }
    expect(hits).toEqual([]);
  });
});
