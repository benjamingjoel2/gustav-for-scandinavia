/**
 * Downloads every Unsplash photo the site uses and writes small, self-hosted copies to public/photos,
 * so pages load photos from the same origin and Vercel's CDN.
 * Output per photo: public/photos/<id>-<width>.avif, one .jpg for browsers without AVIF, and a tiny
 * <id>-blur.webp shown while the photo loads.
 * Existing files are kept, so re-running only processes new photos.
 * Run: npm run build:photos
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { collectPhotoIds } from "../lib/photo-ids";
import { PHOTO_FALLBACK_WIDTH, PHOTO_WIDTHS } from "../lib/photo-widths";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/photos");
const SOURCE_WIDTH = 2400;
const CONCURRENCY = 4;

async function processPhoto(id: string) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${SOURCE_WIDTH}&q=85&fm=jpg`);
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  const source = sharp(Buffer.from(await res.arrayBuffer())).rotate();
  const { width = SOURCE_WIDTH } = await source.metadata();
  if (width < PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1]) console.warn(`${id}: only ${width}px wide`);

  for (const w of PHOTO_WIDTHS) {
    const file = path.join(OUT, `${id}-${w}.avif`);
    if (!existsSync(file)) await source.clone().resize({ width: Math.min(w, width) }).avif({ quality: 50, effort: 4 }).toFile(file);
  }
  const fallback = path.join(OUT, `${id}-${PHOTO_FALLBACK_WIDTH}.jpg`);
  if (!existsSync(fallback)) await source.clone().resize({ width: PHOTO_FALLBACK_WIDTH }).jpeg({ quality: 70, mozjpeg: true, progressive: true }).toFile(fallback);

  const blur = path.join(OUT, `${id}-blur.webp`);
  if (!existsSync(blur)) await source.clone().resize({ width: 24 }).webp({ quality: 50 }).toFile(blur);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const ids = await collectPhotoIds(path.join(ROOT, "data"));
  let next = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < ids.length) {
        const id = ids[next++];
        await processPhoto(id);
        console.log(`${++done}/${ids.length} ${id}`);
      }
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
