import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// A visible build id, so a stale cached page can be told from a current one.
const buildId = process.env.BUILD_ID?.slice(0, 7) || new Date().toISOString().slice(0, 16).replace("T", " ") + " local";

export default defineConfig({
  // Relative asset paths: the site works from the repository's Pages subdirectory.
  base: "./",
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [react()],
  test: { testTimeout: 30_000 },
});
