import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://localhost:8081/openapi.json",
    output: {
      target: "src/generated/orval.ts",
      client: "react-query",
      mode: "tags-split",
      prettier: true,
      override: {
        mutator: {
          path: "src/core/api.ts",
          name: "apiFetcher",
        },
      },
    },
  },
});
