#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const outDir = path.resolve(__dirname, "..", "dist");
const outZipDir = path.resolve(__dirname, "..", "release");
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8"));

if (!fs.existsSync(outDir)) {
  console.error("distが見つかりません。先に`npm run build`を実行してください。");
  process.exit(1);
}
if (!fs.existsSync(outZipDir)) fs.mkdirSync(outZipDir);

const baseName = `${pkg.name || "extension"}-${pkg.version || "0.0.0"}`;
const target = path.join(outZipDir, `${baseName}.zip`);

try {
  execSync(`cd ${outDir} && zip -r ${target} .`, { stdio: "inherit" });
  console.log(`作成: ${target}`);
} catch (e) {
  console.error("zip作成に失敗しました:", e.message);
  process.exit(1);
}
