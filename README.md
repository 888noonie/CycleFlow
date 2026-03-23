# CycleFlow

CycleFlow is a mobile-first PWA for low-friction tracking of hormonal, cognitive, and symptom patterns.

The app is designed for people who want fast daily logging (emoji symptom stacks, quick notes, sliders) and useful pattern visibility across cycle phases.

## Highlights

- Symptom logging with multi-emoji daily lines
- 30-day summary grid with tap-to-inspect details
- Fixed 28-day hormone overlay chart with emoji markers
- Cycle Lens mode for cross-cycle day clustering
- Brain fog and clarity sliders
- Export/share text timeline for clinicians or support teams
- Import + merge timeline flow (helps migrate data between Safari and Home Screen app contexts)
- ChatGPT handoff prompt generator
- Light/Dark/System theme toggle
- Installable PWA (iPhone Safari Add to Home Screen)

## Project structure

- App source: `cycleflow/`
- Planning and test docs:
  - `CycleFlow_Plan.md`
  - `Phase7_Test_Report.md`

## Local development

```bash
cd cycleflow
npm install
npm run dev
```

For phone testing on the same Wi-Fi:

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

When importing this repo in Vercel, use:

- Framework Preset: `Vite`
- Root Directory: `cycleflow`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## iPhone install (no App Store needed)

1. Open deployed HTTPS URL in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Launch from the home icon.

## Data migration tip (Safari vs Home Screen)

iOS can sometimes keep Safari-tab storage separate from Home Screen app storage.

If data appears in Safari but not in the installed icon app:

1. Open Safari version with your existing data.
2. Go to `Export / Share` and copy the timeline text.
3. Open Home Screen app and use `Import timeline` in the same panel.
4. Tap `Import + Merge` to bring entries across.

## Notes

- Data is currently stored on-device (`localStorage`) for privacy and simplicity.
- This app is for self-tracking and reflection, not medical diagnosis.
