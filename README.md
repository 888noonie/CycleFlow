# CycleFlow · free cycle & symptom tracker (PWA) — **v2.1**

**CycleFlow** is a **free, open-source, mobile-first progressive web app (PWA)** for people who need **fast daily logging** and **gentle pattern visibility** across the menstrual cycle—without another paywalled “wellness” subscription.

Built for **symptom tracking**, **mood & energy**, **brain fog / clarity**, **PMDD-aware** patterns, **perimenopause** swings, **ADHD-friendly** frictionless entry, and **Bearable-style** plain-text exports you can share with a clinician or keep private on-device.

> **Not medical advice.** CycleFlow is for self-tracking and reflection, not diagnosis or treatment.

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
- **Gentler UI** — clearer type, focus states, toasts instead of clutter.

Full narrative: [WHATS_NEW_v2.1.md](WHATS_NEW_v2.1.md)

---

## v2.0 highlights

- **Rich symptom legend** — emoji ↔ labels everywhere (picker, timeline tags, map tooltips, export).
- **New symptoms** — e.g. **Puffy Face**, **Blood Present**, plus full **ledger** in export.
- **Export lines with `labels:`** — human-readable names beside emoji stacks for doctors & backups.
- **Pattern Stream** — an endless, scrollable function graph where good days sit high and heavier symptom-load days sit low, with emoji markers plotted directly on the line.
- **Simple by default, powerful on tap** — advanced signal rows and cycle hotspots live behind a compact **Pattern details** drawer.
- **Correlation Lab** — optional before/after windows for a selected symptom, so users can test cascades such as dreams → sweats → pain → fog without cluttering the main view.
- **Demo data** — load a representative sample dataset when the app is empty, useful for trying the analysis views before adding personal data.
- **Daily affirmations** — thousands of combinations, **one fresh line per calendar day**.
- **Themes** — Light / Dark / System, persisted.
- **AI handoff** — copy a structured prompt for ChatGPT-style tools (optional).
- **Import + merge** — move data between **Safari** and **Home Screen** contexts on iOS, or paste a plain-text exported timeline to rebuild the local graph.

---

## SEO / discoverability (GitHub & search)

If you **star** or **fork** this repo, also add GitHub **Topics** so others find it:

`cycle-tracker` · `symptom-tracker` · `pwa` · `period-tracker` · `women-health` · `pmdd` · `perimenopause` · `adhd` · `react` · `vite` · `health` · `open-source` · `free`

**Deploying?** Set your production URL in social previews (Open Graph) if you customize `index.html`—see app `index.html` meta tags.

---

## Project structure

| Path | Purpose |
|------|---------|
| `cycleflow/` | **Vite + React** app (deploy this folder on Vercel) |
| `CycleFlow_Plan.md` | Planning notes |
| `Phase7_Test_Report.md` | Test report |

**License:** [MIT](LICENSE) — free to use and share; attribution appreciated.

**Author / brand:** **N∞N**

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

## Production build

```bash
cd cycleflow
npm run build
npm run preview
```

## Deploy (Vercel)

- **Framework:** Vite  
- **Root Directory:** `cycleflow`  
- **Build:** `npm run build`  
- **Output:** `dist`  
- **Install:** `npm install`

## iPhone install (no App Store)

1. Open your deployed **HTTPS** URL in **Safari**.  
2. **Share** → **Add to Home Screen**.  
3. Launch from the icon.

## Data migration (Safari vs Home Screen on iOS)

Storage can differ between Safari and the installed PWA. Use **Export** → copy → **Import + Merge** in the other context.

---

## Roadmap (post–v2.1 ideas)

- Optional **cloud sync** (opt-in) if an official app store build happens.  
- **Notifications** / reminders (native or web push).  
- **PDF** or **CSV** export.  
- Optional **doctor/clinician report** view generated from the Pattern Stream and correlation windows.
- **Accessibility** audit pass & WCAG tweaks.  
- **Localization** (i18n).  
- **Wearables** or Apple Health (only with explicit consent).

---

**CycleFlow v2.1** · **N∞N** · MIT · built to stay **free** for anyone who needs it.
