# CycleFlow · free cycle & symptom tracker (PWA) — **v2.0**

**CycleFlow** is a **free, open-source, mobile-first progressive web app (PWA)** for people who need **fast daily logging** and **gentle pattern visibility** across the menstrual cycle—without another paywalled “wellness” subscription.

Built for **symptom tracking**, **mood & energy**, **brain fog / clarity**, **PMDD-aware** patterns, **perimenopause** swings, **ADHD-friendly** frictionless entry, and **Bearable-style** plain-text exports you can share with a clinician or keep private on-device.

> **Not medical advice.** CycleFlow is for self-tracking and reflection, not diagnosis or treatment.

---

## Why people use CycleFlow

| Need | How CycleFlow helps |
|------|---------------------|
| **Menstrual cycle / period tracking** | Cycle start date, 28-day map, cycle-day lens |
| **PMDD & luteal symptoms** | Emoji stacks, fog + clarity sliders, export timeline |
| **Perimenopause / hormonal shifts** | Multi-symptom logs + overlays across phases |
| **ADHD & cognitive load** | One-tap emoji, sliders, “today” focus, minimal setup |
| **Privacy-first** | Data stays in **localStorage** on your device (export/import when you choose) |
| **Install like an app** | **PWA**: Add to Home Screen on **iPhone** & **Android**—no App Store required |

---

## v2.0 highlights

- **Rich symptom legend** — emoji ↔ labels everywhere (picker, timeline tags, map tooltips, export).
- **New symptoms** — e.g. **Puffy Face**, **Blood Present**, plus full **ledger** in export.
- **Export lines with `labels:`** — human-readable names beside emoji stacks for doctors & backups.
- **Daily affirmations** — thousands of combinations, **one fresh line per calendar day**.
- **Cycle map path overlay** — after **3+** unique cycle-day logs, a teal path connects your markers; gentle scroll-into-view on first unlock.
- **Themes** — Light / Dark / System, persisted.
- **AI handoff** — copy a structured prompt for ChatGPT-style tools (optional).
- **Import + merge** — move data between **Safari** and **Home Screen** contexts on iOS.

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

## Roadmap (post–v2.0 ideas)

- Optional **cloud sync** (opt-in) if an official app store build happens.  
- **Notifications** / reminders (native or web push).  
- **PDF** or **CSV** export.  
- **Accessibility** audit pass & WCAG tweaks.  
- **Localization** (i18n).  
- **Wearables** or Apple Health (only with explicit consent).

---

**CycleFlow v2.0** · **N∞N** · MIT · built to stay **free** for anyone who needs it.
