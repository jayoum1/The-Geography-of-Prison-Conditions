/**
 * Copies Writing/Bibliography into web/src/data/bibliography.md before Vite build.
 * Strips LaTeX-style period escapes (\. -> .) so markdown renders cleanly.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const src = join(
  repoRoot,
  "Writing",
  "Bibliography",
  "SSA - Youm (1).md",
);
const dest = join(repoRoot, "web", "src", "data", "bibliography.md");

let text = readFileSync(src, "utf8");
text = text.replace(/\\\./g, ".");
writeFileSync(dest, `${text.trimEnd()}\n`, "utf8");
console.log("sync-bibliography:", dest);
