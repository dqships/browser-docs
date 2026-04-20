import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const projectPath = path.join(
  repoRoot,
  "safari",
  "WebToMarkdown",
  "WebToMarkdown.xcodeproj",
  "project.pbxproj"
);

const blocks = {
  appPrivacyBuildFile:
    '\t\tAD3EBF332F96B0010030233A /* PrivacyInfo.xcprivacy in Resources */ = {isa = PBXBuildFile; fileRef = AD3EBF342F96B0010030233A /* PrivacyInfo.xcprivacy */; };',
  extensionPrivacyBuildFile:
    '\t\tAD3EBF352F96B0010030233A /* PrivacyInfo.xcprivacy in Resources */ = {isa = PBXBuildFile; fileRef = AD3EBF362F96B0010030233A /* PrivacyInfo.xcprivacy */; };',
  appPrivacyFileRef:
    '\t\tAD3EBF342F96B0010030233A /* PrivacyInfo.xcprivacy */ = {isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = PrivacyInfo.xcprivacy; sourceTree = "<group>"; };',
  extensionPrivacyFileRef:
    '\t\tAD3EBF362F96B0010030233A /* PrivacyInfo.xcprivacy */ = {isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = PrivacyInfo.xcprivacy; sourceTree = "<group>"; };',
  appGroupChild: '\t\t\t\tAD3EBF342F96B0010030233A /* PrivacyInfo.xcprivacy */,',
  extensionGroupChild: '\t\t\t\tAD3EBF362F96B0010030233A /* PrivacyInfo.xcprivacy */,',
  appResourcesChild: '\t\t\t\tAD3EBF332F96B0010030233A /* PrivacyInfo.xcprivacy in Resources */,',
  extensionResourcesChild: '\t\t\t\tAD3EBF352F96B0010030233A /* PrivacyInfo.xcprivacy in Resources */,',
};

function ensureAfter(content, anchorPattern, block, label) {
  if (content.includes(block)) {
    return content;
  }

  const match = content.match(anchorPattern);

  if (!match) {
    throw new Error(`Unable to find anchor for ${label} in ${projectPath}.`);
  }

  return content.replace(anchorPattern, `${match[0]}\n${block}`);
}

function ensureInMatchedBlock(content, blockPattern, anchorPattern, insertion, label) {
  const blockMatch = content.match(blockPattern);

  if (!blockMatch) {
    throw new Error(`Unable to find block for ${label} in ${projectPath}.`);
  }

  const existingBlock = blockMatch[0];

  if (existingBlock.includes(insertion)) {
    return content;
  }

  const anchorMatch = existingBlock.match(anchorPattern);

  if (!anchorMatch) {
    throw new Error(`Unable to find insertion anchor for ${label} in ${projectPath}.`);
  }

  const updatedBlock = existingBlock.replace(anchorPattern, `${anchorMatch[0]}\n${insertion}`);
  return content.replace(existingBlock, updatedBlock);
}

async function main() {
  let projectContent = await fs.readFile(projectPath, "utf8");

  projectContent = ensureAfter(
    projectContent,
    /^\t\t[A-F0-9]{24} \/\* manifest\.json in Resources \*\/ = \{isa = PBXBuildFile; fileRef = [A-F0-9]{24} \/\* manifest\.json \*\/; \};$/m,
    `${blocks.appPrivacyBuildFile}\n${blocks.extensionPrivacyBuildFile}`,
    "privacy manifest build files"
  );

  projectContent = ensureAfter(
    projectContent,
    /^\t\t[A-F0-9]{24} \/\* manifest\.json \*\/ = \{isa = PBXFileReference; lastKnownFileType = text\.json; name = manifest\.json; path = \.\.\/\.\.\/\.\.\/dist\/(?:chrome|safari)\/manifest\.json; sourceTree = "<group>"; \};$/m,
    `${blocks.appPrivacyFileRef}\n${blocks.extensionPrivacyFileRef}`,
    "privacy manifest file references"
  );

  projectContent = ensureInMatchedBlock(
    projectContent,
    /\t\t[A-F0-9]{24} \/\* WebToMarkdown \*\/ = \{\n[\s\S]*?\t\t\tpath = WebToMarkdown;\n\t\t\tsourceTree = "<group>";\n\t\t\};/,
    /^\t\t\t\t[A-F0-9]{24} \/\* Info\.plist \*\/,$/m,
    blocks.appGroupChild,
    "app group privacy manifest child"
  );

  projectContent = ensureInMatchedBlock(
    projectContent,
    /\t\t[A-F0-9]{24} \/\* WebToMarkdown Extension \*\/ = \{\n[\s\S]*?\t\t\tpath = "WebToMarkdown Extension";\n\t\t\tsourceTree = "<group>";\n\t\t\};/,
    /^\t\t\t\t[A-F0-9]{24} \/\* Info\.plist \*\/,$/m,
    blocks.extensionGroupChild,
    "extension group privacy manifest child"
  );

  projectContent = ensureInMatchedBlock(
    projectContent,
    /\t\t[A-F0-9]{24} \/\* Resources \*\/ = \{\n[\s\S]*?Assets\.xcassets in Resources[\s\S]*?\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t\};/,
    /^\t\t\t\t[A-F0-9]{24} \/\* Assets\.xcassets in Resources \*\/,$/m,
    blocks.appResourcesChild,
    "app resources privacy manifest"
  );

  projectContent = ensureInMatchedBlock(
    projectContent,
    /\t\t[A-F0-9]{24} \/\* Resources \*\/ = \{\n[\s\S]*?manifest\.json in Resources[\s\S]*?\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t\};/,
    /^\t\t\t\t[A-F0-9]{24} \/\* content in Resources \*\/,$/m,
    blocks.extensionResourcesChild,
    "extension resources privacy manifest"
  );

  await fs.writeFile(projectPath, projectContent);
  console.log("✅ Reapplied Safari Xcode project customizations.");
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
});
