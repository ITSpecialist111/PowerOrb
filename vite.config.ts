import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: "src/power-orb-card.ts",
      formats: ["es"],
      fileName: () => "power-orb.js",
    },
    sourcemap: false,
  },
  test: {
    include: ["test/**/*.test.ts"],
  },
});
