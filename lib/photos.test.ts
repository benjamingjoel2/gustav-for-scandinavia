import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { collectPhotoIds } from "./photo-ids";
import { PHOTO_FALLBACK_WIDTH, PHOTO_WIDTHS } from "./photo-widths";

const root = path.join(__dirname, "..");

// Every Unsplash photo referenced in data/ must have its self-hosted copies (npm run build:photos).
describe("self-hosted photos", () => {
  it("has every file for every photo", async () => {
    const ids = await collectPhotoIds(path.join(root, "data"));
    expect(ids.length).toBeGreaterThan(100);
    const missing = ids.flatMap((id) =>
      [...PHOTO_WIDTHS.map((w) => `${id}-${w}.avif`), `${id}-${PHOTO_FALLBACK_WIDTH}.jpg`, `${id}-blur.webp`].filter(
        (file) => !existsSync(path.join(root, "public/photos", file)),
      ),
    );
    expect(missing).toEqual([]);
  });
});
