import {createRoot, type Root} from "react-dom/client";
import OutageTimelineCard, {type OutageTimelineCardConfig} from "./OutageTimelineCard.tsx";

class OutageTimelineCardElement extends HTMLElement {
  private _config?: OutageTimelineCardConfig;
  private _root?: Root;

  setConfig(config: OutageTimelineCardConfig) {
    if (!config.api_url) {
      throw new Error("You must define api_url in the card config");
    }
    this._config = config;
    this._render();
  }

  // Home Assistant passes hass here, we don't use it right now
  set hass(_hass: any) {
    // could be used later if you want HA entities instead of direct API
    this._render();
  }

  connectedCallback() {
    if (!this._root) {
      const shadow = this.attachShadow({mode: "open"});
      this._root = createRoot(shadow);
      this._render();
    }
  }

  private _render() {
    if (!this._root || !this._config) return;

    this._root.render(
        <OutageTimelineCard config={this._config}/>
    );
  }

  public getCardSize() {
    return 2;
  }
}

if (!customElements.get("outage-timeline-card")) {
  customElements.define("outage-timeline-card", OutageTimelineCardElement);
}