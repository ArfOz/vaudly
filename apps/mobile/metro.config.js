const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")
const path = require("path")

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

// 1) Monorepo root'u izle
config.watchFolders = [workspaceRoot]

// 2) Metro'nun node_modules çözümlemesini düzelt
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
]

// 3) Bazı paketler CJS kullanıyor → Expo için gerekli
config.resolver.sourceExts.push("cjs")

// 4) NativeWind entegre et
module.exports = withNativeWind(config, { input: "./global.css" })
