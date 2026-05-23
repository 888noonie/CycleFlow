# CycleFlow **v2.1** (Vite + React PWA)

Deployable web app folder. **Production:** `npm run build` → `dist/`.

**Live app:** [cycle-flow-nu.vercel.app](https://cycle-flow-nu.vercel.app)

## Quick start

```bash
npm install
npm run dev
```

Phone on same Wi‑Fi:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Vercel

| Setting | Value |
|--------|--------|
| Root Directory | `cycleflow` |
| Build | `npm run build` |
| Output | `dist` |

## What’s in v2.1

- **Layout for low cognitive load** — Pattern Stream + 30-day summary before daily logging; every section collapses and remembers state.
- **FlowDock** — bright `›` on the left edge; tap for Graph · 30 days · Log · Save Day.
- **FlowBar** — optional bottom save strip (off by default).
- **Data management** — delete by date range and data type; erase-all needs `DELETE` + 3s hold.
- **Demo data** — sample timeline when storage is empty.
- **Daily affirmation** — one fresh line per calendar day (~8k combinations).
- Symptom **emoji + labels**, **Correlation Lab**, **Cycle Lens**, export/import, AI handoff, PWA install, themes.

See repository root [**README.md**](../README.md) and [**WHATS_NEW_v2.1.md**](../WHATS_NEW_v2.1.md).

**Not a medical device** — for self-tracking only.

## After deploying an update

Existing **Add to Home Screen** installs may need one refresh (or close and reopen) so the service worker picks up v2.1.
