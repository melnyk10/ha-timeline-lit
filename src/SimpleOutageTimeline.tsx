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
  enableVerticalLine?: boolean; // ← NEW
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
                                                                     enableVerticalLine = true,   // ← NEW DEFAULT
                                                                   }) => {
  // Time labels on top: 00:00, 02:00, ..., 24:00
  const ticks: string[] = [];
  for (let h = 0; h <= 24; h += 2) {
    ticks.push(h.toString().padStart(2, "0") + ":00");
  }

  // Positions for labels / lines in %
  const tickPositions = ticks.map((t) => {
    const minutes = timeToMinutes(t);
    return (minutes / MINUTES_IN_DAY) * 100;
  });

  // Normalize intervals for block positioning
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
        {/* Top: hour labels */}
        <div
            style={{
              position: "relative",
              width: "100%",
              height: 16,
              marginBottom: 4,
            }}
        >
          {ticks.map((label, index) => {
            const pos = tickPositions[index];
            return (
                <div
                    key={label}
                    style={{
                      position: "absolute",
                      left: `${pos}%`,
                      transform: "translateX(-50%)",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                >
                  {label}
                </div>
            );
          })}
        </div>

        {/* Middle: track + blocks + optional vertical lines */}
        <div
            style={{
              position: "relative",
              width: "100%",
              height,
              borderRadius,
              backgroundColor: "#e0e0e0",
              overflow: "hidden",
            }}
        >
          {/* Red outage/working blocks */}
          {normalized.map((seg, idx) => (
              <div
                  key={`block-${idx}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${seg.leftPercent}%`,
                    width: `${seg.widthPercent}%`,
                    backgroundColor: "#ff5c5c",
                    borderRadius,
                    zIndex: 1,
                  }}
              />
          ))}

          {/* OPTIONAL vertical lines (00:00 & 24:00 skipped) */}
          {enableVerticalLine &&
              tickPositions.map((pos, index) => {
                if (index === 0 || index === tickPositions.length - 1) return null;

                return (
                    <div
                        key={`tick-line-${index}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          width: "1px",
                          backgroundColor: "#c0c0c0",
                          left: `${pos}%`,
                          transform: "translateX(-0.5px)",
                          opacity: 0.9,
                          zIndex: 2,
                        }}
                    />
                );
              })}
        </div>

        {/* Bottom: start / end labels aligned under edges */}
        <div
            style={{
              position: "relative",
              width: "100%",
              marginTop: 4,
              height: 18,
            }}
        >
          {normalized.map((seg, idx) => {
            const startLeft = seg.leftPercent;
            const endLeft = seg.leftPercent + seg.widthPercent;

            return (
                <React.Fragment key={`labels-${idx}`}>
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