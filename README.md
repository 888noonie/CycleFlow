# CycleFlow · free cycle & symptom tracker (PWA) — **v2.1.1**

**Live app:** [cycle-flow-nu.vercel.app](https://cycle-flow-nu.vercel.app)

**CycleFlow** is a **free, open-source, mobile-first progressive web app (PWA)** for people who need **fast daily logging** and **gentle pattern visibility** across the menstrual cycle—without another paywalled “wellness” subscription.

Built for **symptom tracking**, **mood & energy**, **brain fog / clarity**, **PMDD-aware** patterns, **perimenopause** swings, **ADHD-friendly** frictionless entry, and **Bearable-style** plain-text exports you can share with a clinician or keep private on-device.

> **Not medical advice.** CycleFlow is for self-tracking and reflection, not diagnosis or treatment.

---

## Install CycleFlow (~30 seconds)

No App Store account required. Your data stays on the device.

### iPhone or iPad (recommended: Safari)

1. Open **[cycle-flow-nu.vercel.app](https://cycle-flow-nu.vercel.app)** in **Safari** (not Chrome or an in-app browser).
2. Tap **Share** (↑) at the bottom.
3. Tap **Add to Home Screen** → **Add**.
4. Open **CycleFlow** from your home screen.

**Tip:** If you logged days in Safari before installing, use **Export** in the browser, then **Import + Merge** in the installed app.

### Android (recommended: Chrome)

1. Open the live URL in **Chrome**.
2. Tap **Install now** if the app offers it, **or** menu **⋮** → **Install app** / **Add to Home screen**.
3. Launch from your home screen.

### Computer (Chrome / Edge)

1. Open the live URL.
2. Click **Install** in the address bar (or **Install now** inside the app).
3. Pin the window for quick daily logging.

Inside the app: expand **Install CycleFlow** (bottom sections) for status, **Copy install link**, and platform-specific steps.

---

## Why people use CycleFlow

| Need | How CycleFlow helps |
|------|---------------------|
| **Menstrual cycle / period tracking** | Cycle start date, 28-day map, cycle-day lens |
| **PMDD & luteal symptoms** | Emoji stacks, fog + clarity sliders, continuous Pattern Stream |
| **Perimenopause / hormonal shifts** | Multi-symptom logs, cycle-day lens, and optional correlation windows |
| **ADHD & cognitive load** | One-tap emoji, sliders, “today” focus, minimal setup |
| **Privacy-first** | Data stays in **localStorage** on your device (export/import when you choose) |
| **Install like an app** | **PWA**: Add to Home Screen on **iPhone** & **Android**—no App Store required |

---

## What’s new in v2.1

Built for **PMDD**, **ADHD**, and days when logging feels impossible — v2.1 adds **calmer layout**, **optional navigation docks**, and **safer data control**.

- **See patterns first** — Pattern Stream and 30-day summary sit above daily logging.
- **Your layout, remembered** — every section collapses; reopen only what you need.
- **FlowDock** — bright `›` on the left edge only; tap to open Graph · 30 days · Log · Save Day (🗓️ 📅).
- **FlowBar** — optional bottom save strip; off by default, show when you want one-thumb save.
- **Data management** — delete by date range and data type; erase-all requires typing `DELETE` + a 3-second hold.
- **Easier install** — in-app install banner, one-tap install on Android, platform steps for iPhone.
- **Virus symptom** — 🦠 added to the symptom ledger.

Full narrative: [WHATS_NEW_v2.1.md](WHATS_NEW_v2.1.md)

---

## v2.0 highlights

- **Rich symptom legend** — emoji ↔ labels everywhere (picker, timeline tags, map tooltips, export).
- **Pattern Stream** — scrollable function graph with emoji markers on the line.
- **Correlation Lab** — optional before/after windows for a selected symptom.
- **Demo data**, **daily affirmations**, **themes**, **AI handoff**, **import + merge**.

---

## SEO / discoverability (GitHub & search)

GitHub **Topics:** `cycle-tracker` · `symptom-tracker` · `pwa` · `period-tracker` · `women-health` · `pmdd` · `perimenopause` · `adhd` · `react` · `vite` · `health` · `open-source` · `free`

---

## Project structure

| Path | Purpose |
|------|---------|
| `cycleflow/` | **Vite + React** app (deploy this folder on Vercel) |
| `WHATS_NEW_v2.1.md` | Release notes for partners & testers |
| `CycleFlow_Plan.md` | Planning notes |

**License:** [MIT](LICENSE) · **Author:** **N∞N**

---

## Local development

```bash
cd cycleflow
npm install
npm run dev
```

Phone on same Wi-Fi:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Deploy (Vercel)

| Setting | Value |
|--------|--------|
| Root Directory | `cycleflow` |
| Build | `npm run build` |
| Output | `dist` |

---

## Data migration (Safari vs Home Screen on iOS)

Storage can differ between Safari and the installed PWA. Use **Export** → copy → **Import + Merge** in the other context.

---

## Roadmap (post–v2.1 ideas)

- Optional **app store** build (SDK) after real-world testing.
- **Notifications** / reminders.
- **PDF** or **CSV** export.
- **Accessibility** audit & **localization**.

---

**CycleFlow v2.1.1** · **N∞N** · MIT · built to stay **free** for anyone who needs it.
