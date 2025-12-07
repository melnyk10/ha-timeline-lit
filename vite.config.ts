import {defineConfig} from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/ha-timeline-card.ts",
      name: "OutageTimelineCard",
      fileName: () => "outage-timeline-card.js",
      formats: ["es"],
    },
  },
});