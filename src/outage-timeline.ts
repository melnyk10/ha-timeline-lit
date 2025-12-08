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

  static styles = css`
    :host {
      display: block;
      //padding: 25px;
      //border-radius: 12px;
      //border: 1px solid #ddd;
      //box-sizing: border-box;
      //background: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #222;
      margin-left: 12px;
      margin-right: 12px;
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
    }

    .track {
      position: relative;
      width: 100%;
      background-color: #e0e0e0;
      overflow: hidden;
    }

    .block {
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: #ff5c5c;
      z-index: 1;
    }

    .hour-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #c0c0c0;
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
    }
  `;

  private getTicks(): { label: string; posPercent: number }[] {
    const out: { label: string; posPercent: number }[] = [];
    for (let h = 0; h <= 24; h += 2) {
      const label = `${h.toString().padStart(2, "0")}:00`;
      const posPercent = (h * 60 / MINUTES_IN_DAY) * 100;
      out.push({label, posPercent});
    }
    return out;
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
    const ticks = this.getTicks();
    const normalized = this.getNormalizedIntervals();

    return html`
      <!-- Top hour labels -->
      <div class="top-labels">
        ${ticks.map(
            (t) => html`
              <div class="top-label" style="left: ${t.posPercent}%">
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "simple-outage-timeline": OutageTimeline;
  }
}