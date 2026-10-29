/**
 * Downloads every Unsplash photo the site uses and writes small, self-hosted copies to public/photos,
 * so pages load photos from the same origin and Vercel's CDN.
 * Output per photo: public/photos/<id>-<width>.avif, one .jpg for browsers without AVIF, and a tiny
 * <id>-blur.webp shown while the photo loads.
 * Existing files are kept, so re-running only processes new photos.
 * Run: npm run build:photos
 */
import { existsSync, mkdirSync, renameSync } from "node:fs";
import path from "node:path";
import sharp, { type Sharp } from "sharp";
import { collectPhotoIds } from "../lib/photo-ids";
import { PHOTO_FALLBACK_WIDTH, PHOTO_WIDTHS } from "../lib/photo-widths";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/photos");
const SOURCE_WIDTH = 2400;
const CONCURRENCY = 4;

async function download(id: string, attempt = 1): Promise<Buffer> {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=${SOURCE_WIDTH}&q=85&fm=jpg`);
  if (res.ok) return Buffer.from(await res.arrayBuffer());
  if (attempt >= 5) throw new Error(`${id}: HTTP ${res.status}`);
  await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  return download(id, attempt + 1);
}

/** Write through a temporary file, so an interrupted run never leaves a half-written photo behind. */
async function write(file: string, image: Sharp) {
  if (existsSync(file)) return;
  await image.toFile(`${file}.tmp`);
  renameSync(`${file}.tmp`, file);
}

const outputs = (id: string) => [
  ...PHOTO_WIDTHS.map((w) => path.join(OUT, `${id}-${w}.avif`)),
  path.join(OUT, `${id}-${PHOTO_FALLBACK_WIDTH}.jpg`),
  path.join(OUT, `${id}-blur.webp`),
];

async function processPhoto(id: string) {
  if (outputs(id).every((file) => existsSync(file))) return;
  const source = sharp(await download(id)).rotate();
  const { width = SOURCE_WIDTH } = await source.metadata();
  if (width < PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1]) console.warn(`${id}: only ${width}px wide`);

  for (const w of PHOTO_WIDTHS) {
    await write(path.join(OUT, `${id}-${w}.avif`), source.clone().resize({ width: Math.min(w, width) }).avif({ quality: 50, effort: 4 }));
  }
  await write(path.join(OUT, `${id}-${PHOTO_FALLBACK_WIDTH}.jpg`), source.clone().resize({ width: PHOTO_FALLBACK_WIDTH }).jpeg({ quality: 70, mozjpeg: true, progressive: true }));
  await write(path.join(OUT, `${id}-blur.webp`), source.clone().resize({ width: 24 }).webp({ quality: 50 }));
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
