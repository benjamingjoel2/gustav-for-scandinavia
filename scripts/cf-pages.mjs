// Builds the site for Cloudflare Pages (Git-connected, "advanced mode").
// 1. `npm run cf-build` produces the OpenNext Worker and its static assets.
// 2. `wrangler deploy --dry-run` bundles the Worker into one file (nothing is uploaded).
// 3. The assets and the bundled Worker (as _worker.js) are assembled in dist-pages/ (Worker in dist-pages/_worker.js/),
//    which is the Pages output directory. Static files under /_next/static are served
//    by Pages directly; every other request goes through the Worker.
import { execSync } from "node:child_process";
import fs from "node:fs";
import { builtinModules } from "node:module";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

run("npm run cf-build");
// Copy the prerendered pages into the assets (no-op if cf-build already did it), so pages
// are served from the build instead of being rendered on every request.
run("npx opennextjs-cloudflare populateCache local");
fs.rmSync(".cf-bundle", { recursive: true, force: true });
run("npx wrangler deploy --dry-run --outdir .cf-bundle");
fs.rmSync("dist-pages", { recursive: true, force: true });
fs.cpSync(".open-next/assets", "dist-pages", { recursive: true });
// Pages bundles _worker.js again and only resolves Node built-ins with the "node:" prefix.
const builtins = new Set(builtinModules.filter((m) => !m.startsWith("_")));
const worker = fs
  .readFileSync(".cf-bundle/worker.js", "utf8")
  .replace(/(\bfrom\s*|\bimport\s*\(?\s*)(["'])([a-z_/]+)\2/g, (all, pre, q, mod) =>
    builtins.has(mod) ? `${pre}${q}node:${mod}${q}` : all,
  );
// Directory form (_worker.js/index.js) so modules the bundle imports (fonts, wasm) sit
// next to it; Pages never serves the _worker.js directory publicly.
fs.mkdirSync("dist-pages/_worker.js");
fs.writeFileSync("dist-pages/_worker.js/index.js", worker);
for (const f of fs.readdirSync(".cf-bundle")) {
  if (f === "worker.js" || f.endsWith(".map") || f === "README.md") continue;
  fs.cpSync(`.cf-bundle/${f}`, `dist-pages/_worker.js/${f}`, { recursive: true });
}
fs.writeFileSync(
  "dist-pages/_routes.json",
  JSON.stringify({ version: 1, include: ["/*"], exclude: ["/_next/static/*"] }),
);
console.log("Cloudflare Pages output ready in dist-pages/");
