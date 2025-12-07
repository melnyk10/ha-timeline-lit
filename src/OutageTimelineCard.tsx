import React, {useEffect, useState} from "react";
import SimpleOutageTimeline from "./SimpleOutageTimeline";

export interface OutageTimelineCardConfig {
  type: string;
  title?: string;
  api_url: string;        // full URL, e.g. http://localhost:8070/api/v1/outages/1.1
  schedule_date?: string; // optional: override day (YYYY-MM-DD)
}

interface ApiInterval {
  start: string; // "06:00"
  end: string;   // "11:00"ø
}

interface ApiDayEntry {
  schedule_date: string;    // "2025-12-06"
  updated_at: string;       // "2025-12-06T16:53:00"
  group: string;            // "1.1"
  intervals: ApiInterval[];
}

interface OutageInterval {
  start: string;
  end: string;
  title: string;
  status: string;
}

interface OutageTimelineCardProps {
  config: OutageTimelineCardConfig;
}

const OutageTimelineCard: React.FC<OutageTimelineCardProps> = ({config}) => {
  const [intervals, setIntervals] = useState<OutageInterval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const url = config.api_url;

    setLoading(true);
    setError(null);

    fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((data: ApiDayEntry[]) => {
      if (cancelled) return;

      if (!Array.isArray(data) || data.length === 0) {
        setIntervals([]);
        return;
      }

      const targetDate = config.schedule_date ?? getTodayISO();

      let dayEntry =
          data.find((d) => d.schedule_date === targetDate) ?? data[0];

      if (!dayEntry || !Array.isArray(dayEntry.intervals)) {
        setIntervals([]);
        return;
      }

      const mapped: OutageInterval[] = dayEntry.intervals.map((i) => ({
        start: i.start,
        end: i.end,
        title: `Outage (${dayEntry.group})`,
        status: `Scheduled ${dayEntry.schedule_date}`,
      }));

      setIntervals(mapped);
    })
    .catch((e: any) => {
      if (cancelled) return;
      setError(e.message ?? "Error loading outages");
    })
    .finally(() => {
      if (cancelled) return;
      setLoading(false);
    });

    return () => {
      // just mark as cancelled, don't abort the fetch
      cancelled = true;
    };
  }, [config.api_url, config.schedule_date]);

  return (
      <div style={{padding: "12px", fontFamily: "sans-serif"}}>

        {loading && <div style={{fontSize: "12px"}}>Loading outages…</div>}

        {error && (
            <div style={{fontSize: "12px", color: "var(--error-color, #ff4d4f)"}}>
              Error: {error}
            </div>
        )}

        {!loading && !error && (
            <SimpleOutageTimeline
                intervals={intervals}
                enableVerticalLine={true}
            />
        )}
      </div>
  );
};

function getTodayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default OutageTimelineCard;