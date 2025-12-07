import {defineConfig} from "vite";
import {resolve} from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/timeline-card.ts"),
      name: "TimelineCard",
      fileName: "outage-timeline-card",
      formats: ["es"],
    },
  },
});