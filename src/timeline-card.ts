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

// Lovelace config type
interface OutageTimelineCardConfig {
  type: string;           // required by Lovelace
  title?: string;
  api_url: string;        // <-- used to set apiUrl
  schedule_date?: string; // optional
  enable_vertical_line?: boolean;
}

@customElement("outage-timeline-card")
export class TimelineCard extends LitElement {
  // Lovelace will set this.hass = hass
  private _hass: any;

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

  // Optional: store title so we can show it
  @state()
  private _title: string | undefined;

  @state()
  private _allIntervals: SimpleInterval[] = [];

  @state()
  private _isCompact: boolean = false;

  @state()
  private _noOutages: boolean = false;

  private _mediaQuery?: MediaQueryList;

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow);
    }

    .header {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }
  `;

  // === Lovelace required API ===

  // Called once when user configures the card
  public setConfig(config: OutageTimelineCardConfig): void {
    if (!config.api_url) {
      throw new Error("api_url is required in card config");
    }

    this._title = config.title;
    this.apiUrl = config.api_url;
    this.scheduleDate = config.schedule_date;
    this.enableVerticalLine =
        config.enable_vertical_line ?? this.enableVerticalLine;

    // trigger fetch when config comes
    this._fetchIfReady();
  }

  // HA injects hass object so you can access entities if needed
  set hass(hass: any) {
    this._hass = hass;
  }

  // Hint to HA how tall the card is in "rows"
  public getCardSize(): number {
    return 4;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._mediaQuery = window.matchMedia("(max-width: 600px)");
    this._isCompact = this._mediaQuery.matches;
    this._mediaQuery.addEventListener("change", this._handleMediaChange);
    this._fetchIfReady();
  }

  disconnectedCallback(): void {
    this._mediaQuery?.removeEventListener("change", this._handleMediaChange);
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has("apiUrl") || changedProps.has("scheduleDate")) {
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
    this._allIntervals = [];
    this._noOutages = false;

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

      if (!dayEntry.intervals.length) {
        this._noOutages = true;
        this._allIntervals = [
          {
            start: "00:00",
            end: "24:00",
            title: "No outages",
            status: `Scheduled ${dayEntry.schedule_date}`,
          },
        ];
      } else {
        this._allIntervals = dayEntry.intervals.map((i) => ({
          start: this._normalizeTime(i.start),
          end: this._normalizeTime(i.end),
          title: `Outage (${dayEntry.group})`,
          status: `Scheduled ${dayEntry.schedule_date}`,
        }));
      }
      this._intervals = this._getDisplayIntervals();
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

  private _handleMediaChange = (event: MediaQueryListEvent) => {
    this._isCompact = event.matches;
    this._intervals = this._getDisplayIntervals();
  };

  private _getDisplayIntervals(): SimpleInterval[] {
    if (this._noOutages) {
      return this._allIntervals;
    }
    if (this._isCompact) {
      return this._selectClosestInterval(this._allIntervals);
    }
    return this._allIntervals;
  }

  private _selectClosestInterval(
    intervals: SimpleInterval[]
  ): SimpleInterval[] {
    if (!intervals.length) return [];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      if (h === 24) return 24 * 60;
      return (h || 0) * 60 + (m || 0);
    };

    let current: SimpleInterval | null = null;
    let next: SimpleInterval | null = null;
    let nextDelta = Number.POSITIVE_INFINITY;
    let past: SimpleInterval | null = null;
    let pastDelta = Number.POSITIVE_INFINITY;

    for (const interval of intervals) {
      const start = toMinutes(interval.start);
      const end = toMinutes(interval.end);

      if (nowMinutes >= start && nowMinutes <= end) {
        current = interval;
        break;
      }

      if (start >= nowMinutes) {
        const delta = start - nowMinutes;
        if (delta < nextDelta) {
          nextDelta = delta;
          next = interval;
        }
      } else if (nowMinutes > end) {
        const delta = nowMinutes - end;
        if (delta < pastDelta) {
          pastDelta = delta;
          past = interval;
        }
      }
    }

    if (current) return [current];
    if (next) return [next];
    return past ? [past] : [];
  }

  render() {
    return html`
      <ha-card>
        ${this._title
            ? html`<div class="header">${this._title}</div>`
            : nothing}

        ${this._loading
            ? html`<div class="status loading">Loading outages…</div>`
            : nothing}

        ${this._error
            ? html`<div class="status error">Error: ${this._error}</div>`
            : nothing}

        <simple-outage-timeline
            .intervals=${this._intervals}
            .height=${40}
            .borderRadius=${10}
            .enableVerticalLine=${this.enableVerticalLine}
            .compact=${this._isCompact}
            style=${this._noOutages ? "--timeline-block-color: #3bb54a;" : ""}
        ></simple-outage-timeline>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "outage-timeline-card": TimelineCard;
  }
}
