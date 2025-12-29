// https://docs.expo.dev/guides/using-eslint/
<<<<<<< HEAD
const { defineConfig } = require("eslint/config")
const expoConfig = require("eslint-config-expo/flat")
=======
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
>>>>>>> 6b81f19dca48f7a7180f1f041801c490fa07e5ce

module.exports = defineConfig([
  expoConfig,
  {
<<<<<<< HEAD
    ignores: ["dist/*"],
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".cjs"],
        },
      },
    },
  },
])
=======
    ignores: ['dist/*'],
  },
]);
>>>>>>> 6b81f19dca48f7a7180f1f041801c490fa07e5ce
