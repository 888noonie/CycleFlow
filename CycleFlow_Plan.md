# CycleFlow Build Plan

Working plan for an incremental, mobile-first PWA build.

## Status Snapshot

- Current phase: `Phase 1 - Setup`
- Project folder: `cycleflow/`
- Last updated: `2026-03-23`

## Phase Checklist

## Phase 1 - Setup

- [x] Initialize React app with Vite
- [x] Install core dependencies (`zustand`, `date-fns`, `react-icons`)
- [x] Add Tailwind v4 foundation (`tailwindcss`, `@tailwindcss/vite`)
- [x] Replace starter UI with CycleFlow shell
- [x] Add PWA plugin integration
- [x] Add `manifest.json` + app icons

Notes:
- Completed Option A: pinned Vite to a plugin-compatible major and wired `vite-plugin-pwa`.
- Current icon assets are SVG placeholders (`favicon.svg`, `icons.svg`).
- Upgrade path: replace placeholders with production PNG icon set (`192x192`, `512x512`, maskable).

## Phase 2 - Core UI

- [x] Build `EmojiPicker`
- [x] Build `MoodGrid`
- [x] Build `EstrogenSlider`
- [x] Build `QuickNote`
- [x] Compose all components in `App`

## Phase 3 - State and Persistence

- [x] Create `useCycleStore` with `zustand`
- [x] Persist entries to `localStorage`
- [x] Add daily entry create/update flow
- [x] Add basic schema versioning

## Phase 4 - Dynamic Theming

- [x] Map mood selection to CSS variables
- [x] Update background/accent colors from state
- [x] Add defaults for first-time users

## Phase 5 - Summary View

- [x] Add `SummaryView` 30-day grid
- [x] Show day details on tap
- [x] Add simple trend cues

## Phase 5.5 - Export / Share (doctor-friendly)

- [x] Plain-text timeline export (emoji line format)
- [x] Optional legend key + copy/download

## Phase 5.6 - Hormone phase overlay chart

- [x] Add fixed 28-day phase diagram (follicular/luteal split + ovulation marker)
- [x] Overlay saved entries as emoji markers by cycle day
- [x] Tap/hover marker to inspect date, notes, and symptom stack
- [x] Add editable cycle start date to align overlays

## Phase 5.7 - Pattern intelligence + AI hook

- [x] Add Cycle Lens mode (cross-cycle day clustering)
- [x] Surface hotspot days with log density + avg clarity
- [x] Add one-tap AI handoff panel for ChatGPT context sharing

## Phase 6 - PWA Polish

- [x] Finalize manifest, icons, install prompt behavior
- [x] Add iOS standalone meta tags
- [x] Verify offline behavior and caching

## Phase 7 - Testing and Validation

- [x] Mobile viewport check (`390x844`)
- [ ] iOS Add-to-Home-Screen test
- [ ] Offline mode validation
- [x] Accessibility and tap-target sanity pass

Notes:
- Automated checks and artifact verification are complete.
- iPhone-specific checks are listed in `Phase7_Test_Report.md` and require on-device confirmation.

## Backlog / Future Ideas

- [ ] Cycle variability mode (regular vs irregular/perimenopause)
- [ ] Dark mode toggle
- [ ] Optional haptics fallback support
- [ ] Data export/import
