import {css, html, LitElement, nothing} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import "./outage-timeline";
import type {SimpleInterval} from "./outage-timeline";

interface ApiInterval {
  start: string;
  end: string;
}

interface ApiDayEntry {
  schedule_date: string;
  updated_at: string;
  group: string;
  intervals: ApiInterval[];
}

@customElement("outage-timeline-card")
export class TimelineCard extends LitElement {
  @property({type: String, attribute: "api-url"})
  apiUrl: string = "";

  /**
   * Target date in YYYY-MM-DD. If empty, uses today.
   */
  @property({type: String, attribute: "schedule-date"})
  scheduleDate?: string;

  @property({type: Boolean, attribute: "enable-vertical-line"})
  enableVerticalLine: boolean = true;

  @state()
  private _intervals: SimpleInterval[] = [];

  @state()
  private _loading: boolean = false;

  @state()
  private _error: string | null = null;

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      background: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      color: #222;
    }

    .header {
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .status {
      font-size: 12px;
      margin-bottom: 4px;
    }

    .status.error {
      color: #c0392b;
    }

    .status.loading {
      color: #555;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._fetchIfReady();
  }

  updated(changedProps: Map<string, unknown>): void {
    if (
        changedProps.has("apiUrl") ||
        changedProps.has("scheduleDate")
    ) {
      this._fetchIfReady();
    }
  }

  private _fetchIfReady() {
    if (!this.apiUrl) return;
    this._fetchData();
  }

  private async _fetchData() {
    this._loading = true;
    this._error = null;
    this._intervals = [];

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const raw = await response.json();
      const days = this._normalizeApiData(raw);

      if (!Array.isArray(days) || days.length === 0) {
        this._intervals = [];
        return;
      }

      const targetDate = this.scheduleDate || this._getTodayISO();
      let dayEntry =
          days.find((d) => d.schedule_date === targetDate) ?? days[0];

      if (!dayEntry || !Array.isArray(dayEntry.intervals)) {
        this._intervals = [];
        return;
      }

      this._intervals = dayEntry.intervals.map((i) => ({
        start: this._normalizeTime(i.start),
        end: this._normalizeTime(i.end),
        title: `Outage (${dayEntry.group})`,
        status: `Scheduled ${dayEntry.schedule_date}`,
      }));
    } catch (e: any) {
      console.error("TimelineCard fetch error:", e);
      this._error = e?.message ?? "Error loading outages";
    } finally {
      this._loading = false;
    }
  }

  private _normalizeApiData(raw: unknown): ApiDayEntry[] {
    if (Array.isArray(raw)) {
      return raw as ApiDayEntry[];
    }
    if (raw && typeof raw === "object" && Array.isArray((raw as any).data)) {
      return (raw as any).data as ApiDayEntry[];
    }
    if (raw && typeof raw === "object") {
      return [raw as ApiDayEntry];
    }
    return [];
  }

  private _getTodayISO(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private _normalizeTime(time: string): string {
    // handle "24:00" as end-of-day
    if (time === "24:00") return "24:00";
    return time;
  }

  render() {
    return html`
      ${this._loading
          ? html`
            <div class="status loading">Loading outages…</div>`
          : nothing}

      ${this._error
          ? html`
            <div class="status error">Error: ${this._error}</div>`
          : nothing}

      <simple-outage-timeline
          .intervals=${this._intervals}
          .height=${40}
          .borderRadius=${10}
          .enableVerticalLine=${this.enableVerticalLine}
      ></simple-outage-timeline>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "outage-timeline-card": TimelineCard;
  }
}