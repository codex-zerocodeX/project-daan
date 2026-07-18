const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "dist-check/*"],
  },
  {
    // `expo lint` loads a "typescript" import resolver whose interface
    // eslint-plugin-import rejects ("invalid interface loaded as resolver"),
    // which then makes every import in that file unresolvable. Plain `eslint`
    // is unaffected. Pin the node resolver last so it wins either way.
    // Extensions cover platform-specific files (.web.tsx) and the CSS
    // side-effect import in KomyutMap.web.tsx.
    settings: {
      "import/resolver": {
        node: {
          extensions: [
            ".js",
            ".jsx",
            ".mjs",
            ".cjs",
            ".ts",
            ".tsx",
            ".json",
            ".css",
            ".web.js",
            ".web.jsx",
            ".web.ts",
            ".web.tsx",
            ".native.js",
            ".native.ts",
            ".native.tsx",
            ".ios.tsx",
            ".android.tsx",
          ],
        },
      },
    },
  },
]);
