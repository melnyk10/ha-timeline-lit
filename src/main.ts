import "./outage-timeline-card";

const card = document.querySelector(
    "outage-timeline-card"
) as HTMLElement & {
  apiUrl?: string;
  scheduleDate?: string;
  enableVerticalLine?: boolean;
};

if (card) {
  card.apiUrl = "http://localhost:8070/api/v1/outages/1.1";
  card.enableVerticalLine = true;
}