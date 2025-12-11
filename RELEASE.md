# 🚀 Releasing a New Version – Outage Timeline Card

This document explains **how to publish a new version** of the Outage Timeline Card
using **release-based HACS packaging** (no `dist/` committed).

---

## 🤖 The GitHub workflow

1. Check out the repo.
2. Run `npm ci`.
3. Run `npm run build`.
4. Copy `dist/outage-timeline-card.js` → `outage-timeline-card.js`.
5. Create (or update) a GitHub Release for this tag.
6. Attach `outage-timeline-card.js` as a **release asset**.

You can watch progress under:  
**GitHub → Actions** tab.

---

## 🧪 1. Make and test your changes locally

1. Edit files under `src/` (e.g. `timeline-card.ts`, `outage-timeline.ts`).
2. Run tests / typecheck if you have them.
3. Build locally to verify it still compiles:

```bash
  npm install       # first time or when deps change
  npm run build
```

This ensures `dist/outage-timeline-card.js` builds successfully.

> Note: You **do not** commit `dist/` – it's only for local verification.

---

## 💾 2. Commit and push to main

```bash
  git add .
  git commit -m "Describe your change"
  git push origin main
```

Make sure `main` is green and contains everything you want to release.

---

## 🏷️ 3. Choose the new version number

Use **semantic versioning**:

- `MAJOR.MINOR.PATCH`
- Examples:
    - `v1.0.0` – first stable release
    - `v1.1.0` – new features, backward compatible
    - `v1.1.1` – bug fixes only

Decide what the next version is, e.g. `v1.0.0`.

---

## 🔖 4. Create and push a Git tag

From the root of the repo:

```bash
  git tag v1.0.0
  git push origin v1.0.0
```

Replace `v1.0.0` with your chosen version.

This **tag push** triggers the GitHub Actions workflow.

---

## 📦 5. Verify the Release

Go to:

**GitHub → Releases → vX.Y.Z**

You should see:

- Release title like `Outage Timeline Card vX.Y.Z`.
- Attached asset: `outage-timeline-card.js`.
- (Optional) Release notes (you can paste from `RELEASE.md`).

If the JS asset is present and non-zero size, HACS can use this version.

---

## 🏠 6. Update via HACS in Home Assistant

On your Home Assistant instance:

1. Go to **HACS → Frontend**.
2. Find **Outage Timeline Card**.
3. Click it → you should see the new version `vX.Y.Z`.
4. Click **Update** (or **Install** if first time).
5. After install, hard-refresh the browser:
    - Windows: **Ctrl + F5**
    - Mac: **Cmd + Shift + R**

HACS will:

- Download `outage-timeline-card.js` from the GitHub Release.
- Store it under `/config/www/community/<repo-name>/`.
- Serve it as: `/hacsfiles/<repo-name>/outage-timeline-card.js`.

Your dashboard YAML stays the same:

```yaml
type: custom:outage-timeline-card
title: "Electricity Outages"
api_url: "http://your-api/api/v1/outages"
enable_vertical_line: true
```

---
