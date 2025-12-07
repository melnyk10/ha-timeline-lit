import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/card.tsx"), // our custom-card entry
      name: "OutageTimelineCard",
      fileName: "outage-timeline-card",
      formats: ["es"], // ES module for HA
    },
    rollupOptions: {
      // you can externalize deps if you want, but for HA it's fine to bundle everything
    },
  },
});