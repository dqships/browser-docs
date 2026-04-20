import fs from "node:fs/promises";
import path from "node:path";

const importStatementPattern =
  /^import\s+(?:(\{[^}]+\})\s+from\s+)?["'](.+?)["'];?\s*$/gm;

function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function resolveModuleId(moduleId, specifier) {
  if (!specifier.startsWith(".")) {
    throw new Error(
      `Safari service worker bundling only supports relative imports. Unsupported import "${specifier}" in ${moduleId}.`
    );
  }

  return path.posix.normalize(path.posix.join(path.posix.dirname(moduleId), specifier));
}

function parseNamedImports(importClause) {
  return importClause
    .slice(1, -1)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [imported, local] = part.split(/\s+as\s+/);
      return local ? `${imported.trim()}: ${local.trim()}` : imported.trim();
    })
    .join(", ");
}

function getDependencyIds(moduleId, source) {
  const dependencies = [];

  source.replace(importStatementPattern, (_, importClause, specifier) => {
    dependencies.push(resolveModuleId(moduleId, specifier));
    return "";
  });

  return dependencies;
}

function transformModuleSource(moduleId, source) {
  const exportedNames = [];

  let transformed = source.replace(importStatementPattern, (_, importClause, specifier) => {
    const dependencyId = resolveModuleId(moduleId, specifier);

    if (!importClause) {
      return `require(${JSON.stringify(dependencyId)});`;
    }

    return `const { ${parseNamedImports(importClause)} } = require(${JSON.stringify(dependencyId)});`;
  });

  transformed = transformed.replace(
    /^export\s+async\s+function\s+([A-Za-z_$][\w$]*)\s*\(/gm,
    (_, exportName) => {
      exportedNames.push(exportName);
      return `async function ${exportName}(`;
    }
  );

  transformed = transformed.replace(
    /^export\s+function\s+([A-Za-z_$][\w$]*)\s*\(/gm,
    (_, exportName) => {
      exportedNames.push(exportName);
      return `function ${exportName}(`;
    }
  );

  transformed = transformed.replace(
    /^export\s+(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm,
    (_, declarationKind, exportName) => {
      exportedNames.push(exportName);
      return `${declarationKind} ${exportName} =`;
    }
  );

  const exportBlock =
    exportedNames.length === 0
      ? "module.exports = {};"
      : `module.exports = { ${exportedNames.join(", ")} };`;

  return `${transformed.trim()}\n\n${exportBlock}\n`;
}

async function collectModules(repoRoot, moduleId, moduleMap) {
  if (moduleMap.has(moduleId)) {
    return;
  }

  const sourcePath = path.join(repoRoot, moduleId);
  const source = await fs.readFile(sourcePath, "utf8");
  const dependencyIds = getDependencyIds(moduleId, source);

  for (const dependencyId of dependencyIds) {
    await collectModules(repoRoot, dependencyId, moduleMap);
  }

  moduleMap.set(moduleId, transformModuleSource(moduleId, source));
}

function renderBundle(entryModuleId, moduleMap) {
  const bundledFactories = Array.from(moduleMap.entries())
    .map(
      ([moduleId, transformedSource]) => `${JSON.stringify(moduleId)}: (module, require) => {
${transformedSource
  .split("\n")
  .map((line) => `      ${line}`.trimEnd())
  .join("\n")}
    }`
    )
    .join(",\n");

  return `(() => {
  const modules = {
${bundledFactories}
  };

  const cache = Object.create(null);

  function require(moduleId) {
    const cachedModule = cache[moduleId];

    if (cachedModule) {
      return cachedModule.exports;
    }

    const factory = modules[moduleId];

    if (!factory) {
      throw new Error(\`Safari bundle is missing module: \${moduleId}\`);
    }

    const module = { exports: {} };
    cache[moduleId] = module;
    factory(module, require);
    return module.exports;
  }

  require(${JSON.stringify(entryModuleId)});
})();
`;
}

export async function writeSafariServiceWorkerBundle({
  destinationRoot,
  entryModuleId,
  repoRoot
}) {
  const normalizedEntryModuleId = toPosixPath(entryModuleId);
  const modules = new Map();

  await collectModules(repoRoot, normalizedEntryModuleId, modules);

  const bundleOutput = renderBundle(normalizedEntryModuleId, modules);
  const outputPath = path.join(destinationRoot, normalizedEntryModuleId);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, bundleOutput);
}
