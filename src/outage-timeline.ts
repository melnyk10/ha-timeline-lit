import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";

export interface SimpleInterval {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  title?: string;
  status?: string;
}

const MINUTES_IN_DAY = 24 * 60;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

@customElement("simple-outage-timeline")
export class OutageTimeline extends LitElement {

  @property({type: Array})
  intervals: SimpleInterval[] = [];

  /**
   * Height of the main bar (px).
   */
  @property({type: Number})
  height: number = 40;

  /**
   * Border radius for blocks and track.
   */
  @property({type: Number, attribute: "border-radius"})
  borderRadius: number = 10;

  /**
   * Whether to show vertical hour lines (except at 00:00 and 24:00).
   */
  @property({type: Boolean, attribute: "enable-vertical-line"})
  enableVerticalLine: boolean = true;

  /**
   * Compact mode shows only outage pieces (no full timeline).
   */
  @property({type: Boolean})
  compact: boolean = false;

  static styles = css`
    :host {
      --timeline-text-color: var(--primary-text-color);
      --timeline-track-background: #e0e0e0;
      --timeline-block-color: #ea3434;
      --timeline-hour-line-color: #c0c0c0;
      --timeline-top-label-color: var(--secondary-text-color);
      --timeline-bottom-label-color: var(--primary-text-color);

      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: var(--timeline-text-color);
      margin-left: 12px;
      margin-right: 12px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .timeline {
      min-width: var(--timeline-min-width, 520px);
    }

    .compact-timeline {
      min-width: 0;
      width: 100%;
    }

    .top-labels {
      position: relative;
      width: 100%;
      height: 16px;
      margin-bottom: 4px;
    }

    .top-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      white-space: nowrap;
      color: var(--timeline-top-label-color);
    }

    .track {
      position: relative;
      width: 100%;
      background-color: var(--timeline-track-background);
      overflow: hidden;
    }

    .block {
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: var(--timeline-block-color);
      z-index: 1;
    }

    .hour-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: var(--timeline-hour-line-color);
      opacity: 0.9;
      transform: translateX(-0.5px);
      z-index: 2; /* draw over blocks */
    }

    .bottom-labels {
      position: relative;
      width: 100%;
      margin-top: 4px;
      height: 18px;
    }

    .bottom-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      color: var(--timeline-bottom-label-color);
    }

    .label-left {
      transform: translateX(0);
    }

    .label-right {
      transform: translateX(-100%);
    }

    @media (max-width: 520px) {
      :host {
        margin-left: 8px;
        margin-right: 8px;
      }

      .top-label {
        font-size: 10px;
      }

      .bottom-label {
        font-size: 12px;
      }
    }

    .compact-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `;

  private getTicks(
    startMinute: number = 0,
    endMinute: number = MINUTES_IN_DAY
  ): { label: string; posPercent: number }[] {
    const out: { label: string; posPercent: number }[] = [];
    const span = endMinute - startMinute;
    if (span <= 0) return out;
    for (let h = 0; h <= 24; h += 2) {
      const minute = h * 60;
      if (minute < startMinute || minute > endMinute) continue;
      const label = `${h.toString().padStart(2, "0")}:00`;
      const posPercent = ((minute - startMinute) / span) * 100;
      out.push({label, posPercent});
    }
    return out;
  }

  private getBoundsTicks(
    startMinute: number,
    endMinute: number
  ): { label: string; posPercent: number }[] {
    if (endMinute <= startMinute) return [];
    return [
      {label: this.formatMinutes(startMinute), posPercent: 0},
      {label: this.formatMinutes(endMinute), posPercent: 100},
    ];
  }

  private formatMinutes(minutes: number): string {
    const total = Math.max(0, Math.min(minutes, MINUTES_IN_DAY));
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  private getNormalizedIntervals() {
    return this.intervals.map((interval) => {
      const startMin = timeToMinutes(interval.start);
      const endMin = timeToMinutes(interval.end);
      const leftPercent = (startMin / MINUTES_IN_DAY) * 100;
      const widthPercent = ((endMin - startMin) / MINUTES_IN_DAY) * 100;

      return {...interval, leftPercent, widthPercent};
    });
  }

  render() {
    const normalized = this.getNormalizedIntervals();
    const ticks = this.getTicks();

    if (this.compact) {
      return html`
        <div class="compact-list">
          ${normalized.map((seg) => {
            const label =
                `${seg.title ?? "Outage"}` +
                (seg.status ? ` (${seg.status})` : "") +
                ` ${seg.start}–${seg.end}`;

            const startMin = timeToMinutes(seg.start);
            const endMin = timeToMinutes(seg.end);
            const compactTicks = this.getTicks(startMin, endMin);
            const compactBounds = this.getBoundsTicks(startMin, endMin);
            const compactTopLabels = compactBounds.concat(compactTicks);

            return html`
              <div class="timeline compact-timeline">
                <div class="top-labels">
                  ${compactTopLabels.map(
                      (t) => html`
                        <div
                            class="top-label ${t.posPercent === 0
                                ? "label-left"
                                : t.posPercent === 100
                                  ? "label-right"
                                  : ""}"
                            style="left: ${t.posPercent}%"
                        >
                          ${t.label}
                        </div>
                      `
                  )}
                </div>

                <div
                    class="track"
                    style="
                    height: ${this.height}px;
                    border-radius: ${this.borderRadius}px;
                  "
                >
                  <div
                      class="block"
                      title="${label}"
                      style="
                      left: 0%;
                      width: 100%;
                      border-radius: ${this.borderRadius}px;
                    "
                  ></div>

                  ${this.enableVerticalLine
                      ? compactTicks.map(
                          (t) =>
                            html`<div class="hour-line" style="left: ${t.posPercent}%"></div>`
                        )
                      : nothing}
                </div>

                <div class="bottom-labels">
                  <div class="bottom-label label-left" style="left: 0%">
                    ${seg.start}
                  </div>
                  <div class="bottom-label label-right" style="left: 100%">
                    ${seg.end}
                  </div>
                </div>
              </div>
            `;
          })}
        </div>
      `;
    }

    return html`
      <div class="timeline">
        <!-- Top hour labels -->
        <div class="top-labels">
          ${ticks.map(
              (t) => html`
                <div
                    class="top-label ${t.posPercent === 0
                        ? "label-left"
                        : t.posPercent === 100
                          ? "label-right"
                          : ""}"
                    style="left: ${t.posPercent}%"
                >
                  ${t.label}
                </div>
              `
          )}
        </div>

        <!-- Middle section -->
        <div
            class="track"
            style="
            height: ${this.height}px;
            border-radius: ${this.borderRadius}px;
          "
        >
          <!-- Red working/outage blocks -->
          ${normalized.map((seg, idx) => {
            const label =
                `${seg.title ?? "Interval"}` +
                (seg.status ? ` (${seg.status})` : "") +
                ` ${seg.start}–${seg.end}`;

            return html`
              <div
                  class="block"
                  title="${label}"
                  style="
                  left: ${seg.leftPercent}%;
                  width: ${seg.widthPercent}%;
                  border-radius: ${this.borderRadius}px;
                "
              ></div>
            `;
          })}

          <!-- Vertical hour lines (optional) -->
          ${this.enableVerticalLine
              ? ticks.map((t, index) =>
                  index === 0 || index === ticks.length - 1
                      ? nothing
                      : html`
                        <div class="hour-line" style="left: ${t.posPercent}%"></div>
                      `
              )
              : nothing}
        </div>

        <!-- Bottom start/end labels -->
        <div class="bottom-labels">
          ${normalized.map((seg, idx) => {
            const startLeft = seg.leftPercent;
            const endLeft = seg.leftPercent + seg.widthPercent;

            return html`
              <div class="bottom-label" style="left: ${startLeft}%">
                ${seg.start}
              </div>
              <div class="bottom-label" style="left: ${endLeft}%">
                ${seg.end}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "simple-outage-timeline": OutageTimeline;
  }
}
