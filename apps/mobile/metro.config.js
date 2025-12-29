<<<<<<< HEAD
const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")
const path = require("path")
const projectRoot = __dirname

const workspaceRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]

module.exports = withNativeWind(config, {
  input: "./global.css", // apps/mobile/global.css
})
=======
<<<<<<< HEAD
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
=======
const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'mobile',
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  },
};

module.exports = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  // Change this to true to see debugging info.
  // Useful if you have issues resolving modules
  debug: false,
  // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
  extensions: [],
  // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
  watchFolders: [],
});
>>>>>>> 083c5b8 (Initial monorepo with Nx, Expo, NestJS, Prisma setup)
>>>>>>> 6b81f19dca48f7a7180f1f041801c490fa07e5ce
