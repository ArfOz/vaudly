const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../../");

const config = getDefaultConfig(projectRoot);

// Monorepo klasörünü izlemeye al
config.watchFolders = [workspaceRoot];

// Module alias tanımla
config.resolver.extraNodeModules = {
  "@shared": path.resolve(workspaceRoot, "packages/shared/src"),
  "@database": path.resolve(workspaceRoot, "packages/database/src"),
};

module.exports = withNativeWind(config);
