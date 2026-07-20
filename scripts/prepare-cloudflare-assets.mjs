import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, ".cloudflare-assets");

const entriesToCopy = [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "assets",
  "css",
  "fonts",
  "image",
  "js"
];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

function copyRecursive(sourcePath, targetPath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath)) {
      copyRecursive(path.join(sourcePath, entry), path.join(targetPath, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

for (const entry of entriesToCopy) {
  const sourcePath = path.join(rootDir, entry);
  const targetPath = path.join(outDir, entry);

  if (!fs.existsSync(sourcePath)) {
    continue;
  }

  copyRecursive(sourcePath, targetPath);
}

console.log(`Prepared Cloudflare assets in ${outDir}`);
