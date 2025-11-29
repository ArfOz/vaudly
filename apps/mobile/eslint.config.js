module.exports = {
  extends: ["some-existing-configs"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      node: {
        paths: ["apps/mobile", "packages/shared/src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    // mevcut kurallar burada
  },
};
