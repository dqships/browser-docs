import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "manifest.json");
const projectPath = path.join(
  repoRoot,
  "safari",
  "WebToMarkdown",
  "WebToMarkdown.xcodeproj",
  "project.pbxproj"
);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    build: null,
    incrementBuild: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--increment-build") {
      options.incrementBuild = true;
      continue;
    }

    if (arg === "--build") {
      options.build = args[index + 1] ?? null;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.incrementBuild && options.build !== null) {
    throw new Error("Use either --increment-build or --build <number>, not both.");
  }

  return options;
}

function requireMatch(content, pattern, label) {
  const match = content.match(pattern);

  if (!match) {
    throw new Error(`Unable to find ${label} in ${projectPath}.`);
  }

  return match;
}

function normalizeBuildNumber(rawBuildNumber) {
  if (!/^\d+$/.test(rawBuildNumber)) {
    throw new Error(`Safari build number must be numeric. Received: ${rawBuildNumber}`);
  }

  return String(Number.parseInt(rawBuildNumber, 10));
}

async function main() {
  const options = parseArgs(process.argv);
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const projectContent = await fs.readFile(projectPath, "utf8");

  const marketingVersion = manifest.version;
  const currentBuildMatch = requireMatch(
    projectContent,
    /CURRENT_PROJECT_VERSION = ([^;]+);/,
    "CURRENT_PROJECT_VERSION"
  );
  const currentBuildNumber = currentBuildMatch[1].trim().replaceAll("\"", "");

  let nextBuildNumber = currentBuildNumber;

  if (options.incrementBuild) {
    nextBuildNumber = normalizeBuildNumber(String(Number.parseInt(currentBuildNumber, 10) + 1));
  } else if (options.build !== null) {
    nextBuildNumber = normalizeBuildNumber(options.build);
  }

  let nextProjectContent = projectContent.replace(
    /MARKETING_VERSION = [^;]+;/g,
    `MARKETING_VERSION = ${marketingVersion};`
  );

  if (nextBuildNumber !== currentBuildNumber) {
    nextProjectContent = nextProjectContent.replace(
      /CURRENT_PROJECT_VERSION = [^;]+;/g,
      `CURRENT_PROJECT_VERSION = ${nextBuildNumber};`
    );
  }

  await fs.writeFile(projectPath, nextProjectContent);

  const buildMessage =
    nextBuildNumber === currentBuildNumber
      ? `Safari build preserved at ${currentBuildNumber}`
      : `Safari build updated from ${currentBuildNumber} to ${nextBuildNumber}`;

  console.log(
    `✅ Synced Safari MARKETING_VERSION to ${marketingVersion}. ${buildMessage}.`
  );
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
});
