// Build-time translation for a Next.js App Router site. No i18n library, no client JS.
//
// English is the source. For every other locale this script writes a translated copy of
// the English route tree (`app/(en)` -> `app/<locale>`) and of the shared code it imports
// (`components`, `data`, `config`, `lib` -> `i18n/gen/<locale>/...`). In each copy:
//   - visible English strings (JSX text, prose attributes, prose string/template literals)
//     are replaced with the translation from `i18n/<locale>.json` (keyed by the English text);
//   - internal links ("/journeys/...") get the locale prefix ("/fr/journeys/...");
//   - `@/components/...` style imports point at the locale's copy;
//   - `lib/locale.ts` exports the locale code.
// Every locale is then pre-rendered by `next build` like the English pages.
//
//   node scripts/i18n.mjs            generate (fails if a string has no translation)
//   node scripts/i18n.mjs --extract  write i18n/strings.json (every translatable string, with file)
//   node scripts/i18n.mjs --missing  list strings missing from each dictionary
//
// A file containing the comment `i18n-skip-strings` is copied with imports rewritten only.
// A dictionary value equal to its key leaves the text unchanged (brand names, etc.).

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const cfg = JSON.parse(fs.readFileSync(path.join(root, "i18n/config.json"), "utf8"));
const { locales, defaultLocale, routeSrc, shared, genDir, excludeRoutes = [], overrideDir } = cfg;
const otherLocales = locales.filter((l) => l !== defaultLocale);
const mode = process.argv.includes("--extract") ? "extract" : process.argv.includes("--missing") ? "missing" : "generate";

// Attribute names whose values are never visible text.
const SKIP_ATTRS = new Set([
  "className", "id", "key", "type", "name", "rel", "target", "role", "htmlFor", "variant", "as", "size", "autoComplete",
  "sizes", "inputMode", "method", "lang", "dir", "d", "viewBox", "fill", "stroke", "xmlns", "strokeWidth", "strokeLinecap",
  "strokeLinejoin", "form", "encType", "src", "srcSet", "loading", "decoding", "fetchPriority", "crossOrigin", "media",
  "aria-hidden", "aria-controls", "aria-current", "aria-expanded", "aria-haspopup", "aria-live", "aria-describedby",
  "aria-labelledby", "tabIndex", "pattern", "accept", "inputmode", "enterKeyHint", "preload", "poster", "itemType",
  "itemProp", "property", "httpEquiv", "charSet", "content", "theme", "mode", "align", "justify", "tone", "icon",
  "image", "imageKey", "slug", "kind", "layout", "position", "objectFit", "color", "unit-id", "x", "y", "width", "height",
  "transform", "points", "cx", "cy", "r", "rx", "ry", "x1", "x2", "y1", "y2", "offset", "stopColor", "gradientUnits",
]);
// Object keys whose values are identifiers, not copy.
const SKIP_KEYS = new Set([
  "slug", "id", "key", "src", "image", "imageKey", "heroKey", "icon", "kind", "tier", "budgetTier", "code",
  "symbol", "variant", "className", "as", "size", "hostname", "protocol", "file", "locale", "base", "heroLoop", "heroFull",
  "email", "date", "ratesAsOf", "verifiedOn", "validUntil", "sourceUrl", "url", "style", "weight", "subsets",
  "display", "variable", "path", "loaderFile", "loader", "source", "destination", "theme", "themeColor", "mode",
  "credit", "creditUrl", "orientation", "placeId", "tone", "street", "locality", "postalCode", "country", "@type", "@context", "fit", "format", "status", "dateTime", "timezone",
]);
const SKIP_CALLS = new Set([
  "cn", "clsx", "cva", "require", "fetch", "getItem", "setItem", "removeItem", "addEventListener", "removeEventListener",
  "querySelector", "querySelectorAll", "getAttribute", "setAttribute", "removeAttribute", "matchMedia", "preconnect",
  "preload", "localFont", "NumberFormat", "DateTimeFormat", "join", "resolve", "readFileSync", "existsSync", "readdirSync",
  "set", "get", "has", "delete", "append", "getAll", "startsWith", "endsWith", "split", "replace", "includes", "test",
  "match", "toLocaleDateString", "toLocaleString", "Error", "log", "warn", "error", "info", "redirect", "permanentRedirect",
  "notFound", "useMediaQuery", "scrollIntoView", "getElementById", "createElement", "classList", "toggle", "add", "remove",
]);

const hasLetter = (s) => /[A-Za-zÀ-ÿ]/.test(s);
const looksLikeClasses = (s) => {
  if (/[a-z]\.$/.test(s.trim()) && /\s/.test(s.trim())) return false; // a sentence, not a class list
  const toks = s.trim().split(/\s+/);
  return toks.every((t) => /^[!-]?[a-z0-9@:\[\]\/._%#(),'&>=+*~-]+$/.test(t)) && toks.some((t) => /[-:\[\]\/_]/.test(t) || (/\d/.test(t) && /[a-z]/.test(t)));
};
function isProse(s, { loose = false } = {}) {
  const t = s.trim();
  if (!t || !hasLetter(t)) return false;
  if (/^(https?:|mailto:|tel:|data:|#|\.{0,2}\/|@\/|[a-z]+:\/\/)/.test(t)) return false;
  if (/^[\w.-]+@[\w.-]+$/.test(t)) return false; // email
  if (/^[a-z0-9_.:\/#?=&%-]+$/.test(t)) return loose && /^[a-z]+$/.test(t); // identifier / single lowercase word
  if (/^[A-Z0-9_]+$/.test(t) && t.length <= 4) return false; // codes like USD, EN
  if (/^[a-z]+([A-Z][a-z0-9]*)+$/.test(t)) return false; // camelCase identifier
  if (looksLikeClasses(t)) return false;
  if (/^[\w-]+\.(mdx?|tsx?|jsx?|css|json|png|jpe?g|webp|avif|svg|mp4|woff2?)$/i.test(t)) return false;
  return true;
}
const NON_PAGE = /^\/(api|_next|opengraph-image|twitter-image|icon|apple-icon|manifest|sitemap|robots|images|img|media|video|videos|fonts|files|favicon|icons|og|static|downloads)(\/|$)|\.[a-z0-9]{2,5}([?#]|$)/i;
// top-level folders of public/ hold static files, never pages
const PUBLIC_DIRS = new Set(fs.existsSync(path.join(root, "public")) ? fs.readdirSync(path.join(root, "public"), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
const isPublicFile = (s) => PUBLIC_DIRS.has(s.split(/[/?#]/)[1]);
const isInternalPath = (s) => /^\/(?!\/)/.test(s) && !NON_PAGE.test(s) && !isPublicFile(s) && !/\s/.test(s);
const prefixPath = (s, l) => (s === "/" ? `/${l}` : s.startsWith("/#") || s.startsWith("/?") ? `/${l}${s.slice(1)}` : `/${l}${s}`);

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

function inTypePosition(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isTypeNode(p)) return true;
    if (ts.isStatement(p) || ts.isSourceFile(p)) return false;
  }
  return false;
}
function calleeName(call) {
  const e = call.expression;
  if (ts.isIdentifier(e)) return e.text;
  if (ts.isPropertyAccessExpression(e)) return e.name.text;
  return "";
}
function skipContext(node) {
  const p = node.parent;
  if (!p) return true;
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p) || ts.isImportTypeNode?.(p)) return true;
  if (ts.isExpressionStatement(p)) return true; // directives
  if (ts.isLiteralTypeNode(p) || inTypePosition(node)) return true;
  if ((ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p) || ts.isEnumMember(p)) && p.name === node) return true;
  if (ts.isPropertyAssignment(p)) {
    const k = p.name.getText().replace(/^["']|["']$/g, "");
    if (SKIP_KEYS.has(k)) return true;
  }
  if (ts.isElementAccessExpression(p) && p.argumentExpression === node) return true;
  if (ts.isCallExpression(p) || ts.isNewExpression(p)) {
    const n = ts.isCallExpression(p) ? calleeName(p) : p.expression.getText();
    if (SKIP_CALLS.has(n) || n === "import" || p.expression.kind === ts.SyntaxKind.ImportKeyword) return true;
    if (/^(Intl\.)?(NumberFormat|DateTimeFormat|URL|RegExp)$/.test(n)) return true;
  }
  if (ts.isBinaryExpression(p) && [ts.SyntaxKind.InKeyword, ts.SyntaxKind.InstanceOfKeyword].includes(p.operatorToken.kind)) return true;
  if (ts.isJsxAttribute(p)) {
    const n = p.name.getText();
    if (SKIP_ATTRS.has(n) || n.startsWith("data-")) return true;
  }
  if (ts.isCaseClause(p) && p.expression === node) return false;
  return false;
}
// a single lowercase word is translated only where it is plainly displayed:
// a branch of a conditional (or a concatenation) that sits directly inside a JSX expression
function looseContext(node) {
  let p = node.parent;
  while (p && (ts.isParenthesizedExpression(p) || ts.isConditionalExpression(p) || (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.PlusToken))) p = p.parent;
  return !!p && ts.isJsxExpression(p) && !ts.isJsxAttribute(p.parent);
}
// skip anything nested (within the same expression) in a class/id-like attribute, a cn()/fetch() style call or an id-like key
function skipByAncestors(node) {
  let sawProp = false;
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isStatement(p) || ts.isSourceFile(p) || ts.isFunctionLike(p) || ts.isJsxElement(p) || ts.isJsxSelfClosingElement(p) || ts.isJsxFragment(p)) return false;
    if (ts.isJsxAttribute(p)) { const n = p.name.getText(); return SKIP_ATTRS.has(n) || n.startsWith("data-"); }
    if (!sawProp && ts.isPropertyAssignment(p)) { sawProp = true; if (SKIP_KEYS.has(p.name.getText().replace(/^["']|["']$/g, ""))) return true; }
    if (ts.isCallExpression(p) || ts.isNewExpression(p)) return ts.isCallExpression(p) && SKIP_CALLS.has(calleeName(p));
  }
  return false;
}

const keyFromTemplate = (tpl) => {
  let k = tpl.head.text;
  tpl.templateSpans.forEach((s, i) => (k += `{${i}}` + s.literal.text));
  return k;
};
const escapeTpl = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const jsxSafe = (s) => (/[{}<>]/.test(s) ? `{${JSON.stringify(s)}}` : s);

const extracted = new Map(); // key -> Set(files)
const missing = new Map(); // locale -> Map(key -> file)

function transform(code, file, locale, dict) {
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : file.endsWith(".ts") ? ts.ScriptKind.TS : file.endsWith(".mjs") || file.endsWith(".js") ? ts.ScriptKind.JS : null;
  if (kind === null) return code;
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, kind);
  const edits = [];
  const skipStrings = code.includes("i18n-skip-strings");
  const rel = path.relative(root, file);
  const tr = (key) => {
    const k = key.replace(/\s+/g, " ").trim();
    if (mode === "extract") {
      if (!extracted.has(k)) extracted.set(k, new Set());
      extracted.get(k).add(rel);
      return null;
    }
    if (!dict) return null;
    if (!(k in dict)) {
      if (!missing.has(locale)) missing.set(locale, new Map());
      missing.get(locale).set(k, rel);
      return null;
    }
    const v = dict[k];
    // keep the original's leading/trailing whitespace
    const lead = key.match(/^\s*/)[0].replace(/\s+/g, " "), trail = key.match(/\s*$/)[0].replace(/\s+/g, " ");
    return lead + v + trail;
  };
  const rewriteSpec = (spec) => {
    for (const d of shared) if (spec === `@/${d}` || spec.startsWith(`@/${d}/`)) return `@/${genDir}/${locale}/` + spec.slice(2);
    return spec;
  };
  const visit = (node) => {
    // module specifiers
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const s = node.moduleSpecifier.text, r = locale ? rewriteSpec(s) : s;
      if (r !== s) edits.push([node.moduleSpecifier.getStart(sf) + 1, node.moduleSpecifier.end - 1, r]);
      return;
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      const a = node.arguments[0], r = locale ? rewriteSpec(a.text) : a.text;
      if (r !== a.text) edits.push([a.getStart(sf) + 1, a.end - 1, r]);
      return;
    }
    if (!skipStrings) {
      if (ts.isJsxText(node)) {
        const raw = node.getFullText(sf);
        if (hasLetter(raw) && raw.trim()) {
          const out = tr(raw);
          if (out !== null) {
            const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
            edits.push([node.getStart(sf), node.end, m[1] + jsxSafe(out.trim()) + m[3]]);
          }
        }
        return;
      }
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const s = node.text;
        const start = node.getStart(sf), q = code[start];
        const pp = node.parent;
        const structural = ts.isImportDeclaration(pp) || ts.isExportDeclaration(pp) || ts.isExpressionStatement(pp) || inTypePosition(node) ||
          ((ts.isPropertyAssignment(pp) || ts.isPropertyDeclaration(pp)) && pp.name === node) || (ts.isCallExpression(pp) && pp.expression.kind === ts.SyntaxKind.ImportKeyword);
        if (structural) return;
        if (!isInternalPath(s) && (skipContext(node) || skipByAncestors(node))) return;
        if (isInternalPath(s)) {
          if (locale) edits.push([start, node.end, q === "`" ? "`" + escapeTpl(prefixPath(s, locale)) + "`" : JSON.stringify(prefixPath(s, locale))]);
          return;
        }
        if (isProse(s, { loose: looseContext(node) })) {
          const out = tr(s);
          if (out !== null) {
            const inAttr = ts.isJsxAttribute(node.parent);
            edits.push([start, node.end, inAttr ? `{${JSON.stringify(out)}}` : q === "`" ? "`" + escapeTpl(out) + "`" : JSON.stringify(out)]);
          }
        }
        return;
      }
      if (ts.isTemplateExpression(node)) {
        if (skipContext(node)) { ts.forEachChild(node, visit); return; }
        const head = node.head.text;
        if (isInternalPath(head) || head === "/") {
          if (locale) edits.push([node.head.getStart(sf), node.head.end, "`" + escapeTpl(prefixPath(head, locale)) + "${"]);
          node.templateSpans.forEach((sp) => visit(sp.expression));
          return;
        }
        const key = keyFromTemplate(node);
        const staticText = key.replace(/\{\d+\}/g, " ");
        const articleLike = /^([a-z]+ \{0\}|\{0\} [a-z]+)$/.test(key); // e.g. "the {0}", "{0} safari"
        if ((isProse(staticText) && hasLetter(staticText)) || articleLike) {
          const out = tr(key);
          if (out !== null) {
            const order = (out.match(/\{(\d+)\}/g) || []).map((m) => +m.slice(1, -1));
            const inOrder = order.length === node.templateSpans.length && order.every((n, i) => n === i);
            if (inOrder) {
              // replace only the literal parts, and keep translating inside the expressions
              const parts = out.split(/\{\d+\}/);
              edits.push([node.head.getStart(sf) + 1, node.head.end - 2, escapeTpl(parts[0])]);
              node.templateSpans.forEach((sp, i) => {
                const lit = sp.literal, isTail = ts.isTemplateTail(lit);
                edits.push([lit.getStart(sf) + 1, lit.end - (isTail ? 1 : 2), escapeTpl(parts[i + 1])]);
                visit(sp.expression);
              });
              return;
            }
            const exprs = node.templateSpans.map((sp) => sp.expression.getText(sf));
            const rebuilt = "`" + out.split(/(\{\d+\})/).map((part) => {
              const m = part.match(/^\{(\d+)\}$/);
              return m ? "${" + exprs[+m[1]] + "}" : escapeTpl(part);
            }).join("") + "`";
            edits.push([node.getStart(sf), node.end, rebuilt]);
            return;
          }
        }
        node.templateSpans.forEach((sp) => visit(sp.expression));
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!edits.length) return code;
  edits.sort((a, b) => b[0] - a[0]);
  let out = code;
  let lastStart = Infinity;
  for (const [s, e, r] of edits) {
    if (e > lastStart) continue; // overlapping (nested) edit: outer wins
    out = out.slice(0, s) + r + out.slice(e);
    lastStart = s;
  }
  return out;
}

function sourceFiles() {
  const list = [];
  for (const f of walkFiles(path.join(root, routeSrc))) {
    const rel = path.relative(path.join(root, routeSrc), f);
    if (excludeRoutes.some((r) => rel === r || rel.startsWith(r + path.sep))) continue; // English-only (e.g. internal pages)
    list.push([f, rel, "route"]);
  }
  for (const d of shared) for (const f of walkFiles(path.join(root, d)).filter((f) => !/\.test\.[tj]sx?$/.test(f))) list.push([f, path.join(d, path.relative(path.join(root, d), f)), "shared"]);
  return list;
}

const dicts = Object.fromEntries(otherLocales.map((l) => {
  const p = path.join(root, "i18n", `${l}.json`);
  return [l, fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {}];
}));

if (mode === "extract") {
  for (const [f] of sourceFiles()) transform(fs.readFileSync(f, "utf8"), f, null, null);
  const arr = [...extracted].map(([k, files]) => ({ key: k, files: [...files] }));
  fs.writeFileSync(path.join(root, "i18n/strings.json"), JSON.stringify(arr, null, 1));
  console.log(`${arr.length} strings -> i18n/strings.json`);
  process.exit(0);
}

for (const l of otherLocales) {
  const outRoutes = path.join(root, "app", l);
  const outShared = path.join(root, genDir, l);
  if (mode === "generate") {
    fs.rmSync(outRoutes, { recursive: true, force: true });
    fs.rmSync(outShared, { recursive: true, force: true });
  }
  for (const [f, rel, kindOf] of sourceFiles()) {
    const dest = kindOf === "route" ? path.join(outRoutes, rel) : path.join(outShared, rel);
    let code;
    if (/\.(tsx?|mjs|js)$/.test(f)) {
      code = transform(fs.readFileSync(f, "utf8"), f, l, dicts[l]);
      if (rel === path.join("lib", "locale.ts")) code = code.replace(/export const locale(: [^=]+)? = "[a-z]{2}"/, `export const locale$1 = "${l}"`);
    }
    if (mode === "generate") {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      // Translated literals no longer match English string-literal union types, so the copies are
      // not type-checked (the English source they are generated from is).
      if (code !== undefined) {
        const directive = code.match(/^\s*(["'])use (client|server)\1;?\s*\n/);
        const head = `// Generated by scripts/i18n.mjs from ${path.relative(root, f)}. Do not edit.\n// @ts-nocheck\n`;
        fs.writeFileSync(dest, directive ? directive[0] + head + code.slice(directive[0].length) : head + code);
      }
      else {
        // Prose files (MDX) are translated by hand: i18n/content/<locale>/<path> replaces the English copy.
        const override = overrideDir && path.join(root, overrideDir, l, rel);
        if (override && fs.existsSync(override)) {
          // internal Markdown links get the locale prefix
          const text = fs.readFileSync(override, "utf8").replace(/\]\((\/[^)\s]*)\)/g, (m, p) => (isInternalPath(p) || p === "/" ? `](${prefixPath(p, l)})` : m));
          fs.writeFileSync(dest, text);
        }
        else if (overrideDir && /\.mdx?$/.test(f) && !process.env.I18N_LENIENT) throw new Error(`No ${l} translation for ${rel} (expected ${path.relative(root, override)})`);
        else fs.copyFileSync(f, dest);
      }
    }
  }
}
let total = 0;
for (const [l, m] of missing) {
  total += m.size;
  console.error(`\n${l}: ${m.size} untranslated strings`);
  for (const [k, f] of [...m].slice(0, mode === "missing" ? Infinity : 15)) console.error(`  ${JSON.stringify(k)}  (${f})`);
}
if (mode === "missing") {
  fs.writeFileSync(path.join(root, "i18n/missing.json"), JSON.stringify(Object.fromEntries([...missing].map(([l, m]) => [l, [...m.keys()]])), null, 1));
  process.exit(0);
}
if (total && !process.env.I18N_LENIENT) {
  console.error("\nAdd the strings above to i18n/<locale>.json (or run with I18N_LENIENT=1 to fall back to English).");
  process.exit(1);
}
console.log(`i18n: generated ${otherLocales.join(", ")} from ${routeSrc}`);
