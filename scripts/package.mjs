// Zips dist/chrome for the Chrome Web Store: release/webtomarkdown-chrome-<version>.zip.
// Usage: node build.mjs && node scripts/package.mjs
// Plain Node with fixed timestamps, so the same code always makes the same zip.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateRawSync } from "node:zlib";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME_DIR = path.join(ROOT_DIR, "dist/chrome");
const RELEASE_DIR = path.join(ROOT_DIR, "release");
const FIXED_DOS_DATE = 0x00210000; // 1980-01-01
const UTF8_NAMES_FLAG = 0x0800;
const DEFLATE_METHOD = 8;
const ZIP_VERSION = 20;

function listFiles() {
  return fs
    .readdirSync(CHROME_DIR, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.endsWith(".map") && entry.name !== ".DS_Store")
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
}

function buildLocalHeader({ crc, packedSize, rawSize, nameLength }) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(ZIP_VERSION, 4);
  header.writeUInt16LE(UTF8_NAMES_FLAG, 6);
  header.writeUInt16LE(DEFLATE_METHOD, 8);
  header.writeUInt32LE(FIXED_DOS_DATE, 10);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(packedSize, 18);
  header.writeUInt32LE(rawSize, 22);
  header.writeUInt16LE(nameLength, 26);
  return header;
}

function buildCentralHeader({ crc, packedSize, rawSize, nameLength, offset }) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(ZIP_VERSION, 4);
  header.writeUInt16LE(ZIP_VERSION, 6);
  header.writeUInt16LE(UTF8_NAMES_FLAG, 8);
  header.writeUInt16LE(DEFLATE_METHOD, 10);
  header.writeUInt32LE(FIXED_DOS_DATE, 12);
  header.writeUInt32LE(crc, 16);
  header.writeUInt32LE(packedSize, 20);
  header.writeUInt32LE(rawSize, 24);
  header.writeUInt16LE(nameLength, 28);
  header.writeUInt32LE(offset, 42);
  return header;
}

function buildEndRecord({ fileCount, centralSize, centralOffset }) {
  const record = Buffer.alloc(22);
  record.writeUInt32LE(0x06054b50, 0);
  record.writeUInt16LE(fileCount, 8);
  record.writeUInt16LE(fileCount, 10);
  record.writeUInt32LE(centralSize, 12);
  record.writeUInt32LE(centralOffset, 16);
  return record;
}

function buildZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const name = Buffer.from(path.relative(CHROME_DIR, file).split(path.sep).join("/"));
    const data = fs.readFileSync(file);
    const packed = deflateRawSync(data, { level: 9 });
    const entry = { crc: crc32(data), packedSize: packed.length, rawSize: data.length, nameLength: name.length };
    const localHeader = buildLocalHeader(entry);

    localParts.push(localHeader, name, packed);
    centralParts.push(buildCentralHeader({ ...entry, offset }), name);
    offset += localHeader.length + name.length + packed.length;
  }

  const central = Buffer.concat(centralParts);
  const end = buildEndRecord({ fileCount: files.length, centralSize: central.length, centralOffset: offset });
  return Buffer.concat([...localParts, central, end]);
}

function main() {
  const manifestPath = path.join(CHROME_DIR, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("dist/chrome is missing. Run node build.mjs first.");
  }

  const { version } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const files = listFiles();
  const outPath = path.join(RELEASE_DIR, `webtomarkdown-chrome-${version}.zip`);

  fs.mkdirSync(RELEASE_DIR, { recursive: true });
  fs.writeFileSync(outPath, buildZip(files));
  console.log(`${path.relative(ROOT_DIR, outPath)}: ${files.length} files`);
}

main();
