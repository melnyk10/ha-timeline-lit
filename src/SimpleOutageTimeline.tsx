import React from "react";

export interface SimpleInterval {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  title?: string;
  status?: string;
}

interface SimpleOutageTimelineProps {
  intervals: SimpleInterval[];
  height?: number;          // px
  borderRadius?: number;    // px
}

const MINUTES_IN_DAY = 24 * 60;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

const SimpleOutageTimeline: React.FC<SimpleOutageTimelineProps> = ({
                                                                     intervals,
                                                                     height = 40,
                                                                     borderRadius = 10,
                                                                   }) => {
  // ticks: 00:00, 02:00, ..., 24:00
  const ticks: string[] = [];
  for (let h = 0; h <= 24; h += 2) {
    ticks.push(h.toString().padStart(2, "0") + ":00");
  }

  // normalize intervals for positioning on 0–24h
  const normalized = intervals.map((i) => {
    const startMin = Math.max(0, timeToMinutes(i.start));
    const endMin = Math.min(MINUTES_IN_DAY, timeToMinutes(i.end));
    const widthMin = Math.max(0, endMin - startMin);

    return {
      ...i,
      leftPercent: (startMin / MINUTES_IN_DAY) * 100,
      widthPercent: (widthMin / MINUTES_IN_DAY) * 100,
    };
  });

  return (
      <div style={{width: "100%", fontFamily: "sans-serif", fontSize: 12}}>
        {/* Top: time ticks */}
        <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
              padding: "0 2px",
            }}
        >
          {ticks.map((t) => (
              <div key={t} style={{transform: "translateX(-50%)"}}>
                {t}
              </div>
          ))}
        </div>

        {/* Middle: track + working/outage blocks */}
        <div
            style={{
              position: "relative",
              width: "100%",
              height,
              borderRadius,
              backgroundColor: "#e0e0e0", // non-working
              overflow: "hidden",
            }}
        >
          {normalized.map((seg, idx) => (
              <div
                  key={idx}
                  title={
                    seg.title
                        ? `${seg.title}${
                            seg.status ? ` (${seg.status})` : ""
                        } ${seg.start}–${seg.end}`
                        : `${seg.start}–${seg.end}${
                            seg.status ? ` (${seg.status})` : ""
                        }`
                  }
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${seg.leftPercent}%`,
                    width: `${seg.widthPercent}%`,
                    backgroundColor: "#ff5c5c",
                    borderRadius,
                  }}
              />
          ))}
        </div>

        {/* Bottom: start at beginning of block, end at end of block */}
        <div
            style={{
              position: "relative",
              width: "100%",
              marginTop: 4,
              height: 18, // label row height
            }}
        >
          {normalized.map((seg, idx) => {
            const startLeft = seg.leftPercent;
            const endLeft = seg.leftPercent + seg.widthPercent;

            return (
                <React.Fragment key={idx}>
                  {/* Start time at beginning of block */}
                  <div
                      style={{
                        position: "absolute",
                        left: `${startLeft}%`,
                        transform: "translateX(-50%)",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                  >
                    {seg.start}
                  </div>

                  {/* End time at end of block */}
                  <div
                      style={{
                        position: "absolute",
                        left: `${endLeft}%`,
                        transform: "translateX(-50%)",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                  >
                    {seg.end}
                  </div>
                </React.Fragment>
            );
          })}
        </div>
      </div>
  );
};

export default SimpleOutageTimeline;