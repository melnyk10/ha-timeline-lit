import {defineConfig} from "vite";
import {resolve} from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/outage-timeline-card.ts"),
      name: "OutageTimelineCard",
      fileName: "outage-timeline-card",
      formats: ["es"],
    },
  },
});