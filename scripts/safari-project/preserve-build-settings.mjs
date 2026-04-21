const buildConfigurationBlockPatternSource =
  /\t\t[A-F0-9]{24} \/\* [^*]+ \*\/ = \{\n\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = \{\n([\s\S]*?)\n\t\t\t\};\n\t\t\tname = ([^;]+);\n\t\t\};/g;

const deploymentTargetKeys = [
  "MACOSX_DEPLOYMENT_TARGET",
  "IPHONEOS_DEPLOYMENT_TARGET",
  "TVOS_DEPLOYMENT_TARGET",
  "WATCHOS_DEPLOYMENT_TARGET",
  "XROS_DEPLOYMENT_TARGET",
];

const preservedKeysByRole = {
  app: [
    "DEVELOPMENT_TEAM",
    "PRODUCT_BUNDLE_IDENTIFIER",
    "INFOPLIST_KEY_LSApplicationCategoryType",
    "INFOPLIST_KEY_ITSAppUsesNonExemptEncryption",
    ...deploymentTargetKeys,
  ],
  extension: [
    "DEVELOPMENT_TEAM",
    "PRODUCT_BUNDLE_IDENTIFIER",
    "INFOPLIST_KEY_ITSAppUsesNonExemptEncryption",
    ...deploymentTargetKeys,
  ],
  project: deploymentTargetKeys,
};

function getBuildConfigurationBlockPattern() {
  return new RegExp(
    buildConfigurationBlockPatternSource.source,
    buildConfigurationBlockPatternSource.flags
  );
}

function parseBuildSettings(settingsBlock) {
  const settings = {};

  for (const line of settingsBlock.split("\n")) {
    const match = line.match(/^\t\t\t\t([A-Za-z0-9_]+) = (.+);$/);

    if (match) {
      settings[match[1]] = match[2];
    }
  }

  return settings;
}

function detectBuildConfigurationRole(settings) {
  if (settings.INFOPLIST_FILE === "WebToMarkdown/Info.plist") {
    return "app";
  }

  if (settings.INFOPLIST_FILE === '"WebToMarkdown Extension/Info.plist"') {
    return "extension";
  }

  if (settings.SDKROOT === "macosx" && settings.INFOPLIST_FILE === undefined) {
    return "project";
  }

  return null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setBuildSetting(block, key, value) {
  const settingPattern = new RegExp(
    `^(\\t\\t\\t\\t${escapeRegExp(key)} = ).+(;)$`,
    "m"
  );

  if (settingPattern.test(block)) {
    return block.replace(settingPattern, `$1${value}$2`);
  }

  return block.replace(/\n\t\t\t\};/, `\n\t\t\t\t${key} = ${value};\n\t\t\t};`);
}

function applySettingsToBlock(block, settingsToApply) {
  let nextBlock = block;

  for (const [key, value] of Object.entries(settingsToApply)) {
    nextBlock = setBuildSetting(nextBlock, key, value);
  }

  return nextBlock;
}

function mapPreservedSettings(content) {
  const preservedSettings = {
    app: {},
    extension: {},
    project: {},
  };

  for (const match of content.matchAll(getBuildConfigurationBlockPattern())) {
    const settings = parseBuildSettings(match[1]);
    const configurationName = match[2].trim();
    const role = detectBuildConfigurationRole(settings);

    if (!role) {
      continue;
    }

    const preservedKeys = preservedKeysByRole[role];
    const scopedSettings = {};

    for (const key of preservedKeys) {
      if (settings[key] !== undefined) {
        scopedSettings[key] = settings[key];
      }
    }

    if (Object.keys(scopedSettings).length > 0) {
      preservedSettings[role][configurationName] = scopedSettings;
    }
  }

  return preservedSettings;
}

export function collectPreservedBuildSettings(projectContent) {
  return mapPreservedSettings(projectContent);
}

export function applyPreservedBuildSettings(projectContent, preservedSettings) {
  let nextProjectContent = "";
  let previousIndex = 0;

  for (const match of projectContent.matchAll(getBuildConfigurationBlockPattern())) {
    const matchedBlock = match[0];
    const settings = parseBuildSettings(match[1]);
    const configurationName = match[2].trim();
    const role = detectBuildConfigurationRole(settings);
    const replacementStart = match.index ?? 0;
    const replacementEnd = replacementStart + matchedBlock.length;

    let nextBlock = matchedBlock;

    if (role) {
      const settingsToApply = preservedSettings[role]?.[configurationName];

      if (settingsToApply && Object.keys(settingsToApply).length > 0) {
        nextBlock = applySettingsToBlock(matchedBlock, settingsToApply);
      }
    }

    nextProjectContent += projectContent.slice(previousIndex, replacementStart);
    nextProjectContent += nextBlock;
    previousIndex = replacementEnd;
  }

  nextProjectContent += projectContent.slice(previousIndex);

  return nextProjectContent;
}
