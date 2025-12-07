# ⚡ Outage Timeline Card for Home Assistant

A modern, clean Lovelace card that displays **electricity outage intervals** on a visual timeline.  
Built with **Lit + TypeScript**, fully compatible with **HACS**, and easy to customize.

---

## 🚀 Features

- Visual timeline showing outage intervals
- Automatic data fetch from your API
- Optional vertical hour markers
- Native Home Assistant styling using `ha-card`
- HACS-installable (no manual file copying)
---

## 📦 Installation (via HACS)

You can install this card in **seconds** using HACS.

### 1. Open HACS
Navigate to:

```
HACS → Frontend
```

### 2. Add Custom Repository
Open the menu:  
**⋮ (top-right)** → **Custom repositories**

Then fill in:

- **Repository URL:**  
  https://github.com/melnyk10/ha-timeline-lit
- **Category:** Frontend

Click **Add**.

### 3. Install the Card
Once added:

- Go to **HACS → Frontend**
- Locate **Outage Timeline Card**
- Click **Install**
---

## 🧩 Usage

Add a **Manual** card to your dashboard and paste:

```yaml
type: custom:outage-timeline-card
title: "Electricity outages"
api_url: "http://your-api/api/v1/outages"
schedule_date: "2025-12-07"     # optional — defaults to today
enable_vertical_line: true      # optional — defaults to true
```

Works with **YAML dashboards** and **UI dashboards**.

---

## ⚙️ Configuration Options

| Option                  | Type    | Default            | Description |
|-------------------------|---------|--------------------|-------------|
| api_url                 | string  | —                  | **Required**. Your outage API endpoint. |
| title                   | string  | Outage timeline    | Optional card header. |
| schedule_date           | string  | Today              | Show outages for this date (YYYY-MM-DD). |
| enable_vertical_line    | boolean | true               | Render hour separator markers. |

---

## 🛠️ Local Development

Clone the repository and install:

```bash
  npm install
```

Build the card:

```bash
  npm run build
```

Output bundle will appear in:

```
dist/outage-timeline-card.js
```

This is the file HACS installs into Home Assistant.

---

## 📁 Repository Structure

```
src/
  ha-lovelace-timeline-card.ts   # Lovelace wrapper + card logic
  outage-timeline.ts             # Timeline component
dist/
  outage-timeline-card.js        # Build output
hacs.json
package.json
README.md
vite.config.ts
```

---

## 📜 License

MIT © 2025 Orest Melnyk

You are free to modify and redistribute.

---

## ⭐ Support & Contributions

If you find this component useful:

- ⭐ Star the GitHub repository
- 🐛 Open issues for bug reports
- 🔧 Submit pull requests
- 💬 Ask for help anytime!

Enjoy your new outage timeline card!
