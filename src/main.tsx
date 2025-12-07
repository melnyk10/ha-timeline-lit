import React from "react";
import ReactDOM from "react-dom/client";
import OutageTimelineCard from "./OutageTimelineCard";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <OutageTimelineCard
          config={{
            type: "test",
            api_url: "http://localhost:8070/api/v1/outages/1.1",
            schedule_date: "2025-12-06", // or omit to use today
          }}
      />
    </React.StrictMode>
);