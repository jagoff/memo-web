import { readdir, readFile, realpath } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const DIST_DIRECTORY = resolve("dist");
const MAX_GZIP_BYTES = 122_880;

async function findJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);

      if (entry.isDirectory()) return findJavaScriptFiles(path);
      return entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
    }),
  );

  return files.flat();
}

const discoveredFiles = await findJavaScriptFiles(DIST_DIRECTORY);
const uniqueFiles = [
  ...new Set(await Promise.all(discoveredFiles.map((path) => realpath(path)))),
];
let total = 0;

for (const path of uniqueFiles) {
  total += gzipSync(await readFile(path), { level: 9 }).byteLength;
}

console.log(`JavaScript gzip total: ${total} bytes`);

if (total > MAX_GZIP_BYTES) {
  console.error(
    `JavaScript gzip budget exceeded by ${total - MAX_GZIP_BYTES} bytes ` +
      `(limit: ${MAX_GZIP_BYTES} bytes).`,
  );
  process.exitCode = 1;
}
