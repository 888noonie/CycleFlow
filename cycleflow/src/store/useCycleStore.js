import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEMO_CYCLE_START_DATE, DEMO_ENTRIES } from '../data/demoEntries'
import { applyDeletion } from '../utils/dataDeletion'

const STORAGE_KEY = 'cycleflow-storage-v1'
const SCHEMA_VERSION = 1

function normalizeSymptoms(entry) {
  if (Array.isArray(entry?.symptoms)) {
    return entry.symptoms
  }
  if (entry?.emoji) {
    return [entry.emoji]
  }
  return []
}

function primaryEmojiFromSymptoms(symptoms) {
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return '🫥'
  }
  return symptoms[0]
}

function splitEmojiSequence(value) {
  if (!value) {
    return []
  }
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return [...segmenter.segment(value)].map((part) => part.segment).filter(Boolean)
  }
  return Array.from(value)
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function defaultDraft(date = todayKey()) {
  return {
    date,
    emoji: '🫥',
    symptoms: [],
    color: '#86d4c6',
    estrogen: 0.7,
    fog: 0.4,
    note: '',
  }
}

const useCycleStore = create(
  persist(
    (set, get) => ({
      schemaVersion: SCHEMA_VERSION,
      entries: [],
      draft: defaultDraft(),
      cycleStartDate: todayKey(),
      activeDate: todayKey(),

      setDraftField: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value },
        })),

      setCycleStartDate: (value) => set(() => ({ cycleStartDate: value })),
      setActiveDate: (value) =>
        set((state) => {
          const existing = state.entries.find((entry) => entry.date === value)
          if (!existing) {
            return { activeDate: value, draft: defaultDraft(value) }
          }
          const symptoms = normalizeSymptoms(existing)
          return {
            activeDate: value,
            draft: {
              ...existing,
              symptoms,
              emoji: primaryEmojiFromSymptoms(symptoms),
              fog: existing.fog ?? 0.4,
            },
          }
        }),

      hydrateDraftForToday: () =>
        set((state) => {
          const date = state.activeDate || todayKey()
          const existing = state.entries.find((entry) => entry.date === date)
          if (!existing) {
            return { draft: defaultDraft(date), activeDate: date }
          }

          const symptoms = normalizeSymptoms(existing)
          return {
            activeDate: date,
            draft: {
              ...existing,
              symptoms,
              emoji: primaryEmojiFromSymptoms(symptoms),
              fog: existing.fog ?? 0.4,
            },
          }
        }),

      saveDraftEntry: () =>
        set((state) => {
          const date = state.activeDate || todayKey()
          const nextEntry = {
            ...state.draft,
            id: state.draft.id ?? date,
            symptoms: normalizeSymptoms(state.draft),
            emoji: primaryEmojiFromSymptoms(normalizeSymptoms(state.draft)),
            fog: Number(state.draft.fog ?? 0.4),
            date,
            updatedAt: new Date().toISOString(),
          }

          const existingIndex = state.entries.findIndex((entry) => entry.date === date)
          const nextEntries =
            existingIndex >= 0
              ? state.entries.map((entry, index) =>
                  index === existingIndex ? nextEntry : entry
                )
              : [...state.entries, nextEntry]

          return {
            entries: nextEntries.sort((a, b) => b.date.localeCompare(a.date)),
            draft: nextEntry,
            activeDate: date,
          }
        }),

      saveTodayEntry: () => {
        const today = todayKey()
        get().setActiveDate(today)
        get().saveDraftEntry()
      },

      importEntries: (incomingEntries) =>
        set((state) => {
          const byDate = new Map(state.entries.map((entry) => [entry.date, entry]))

          for (const incoming of incomingEntries) {
            if (!incoming?.date) {
              continue
            }
            const existing = byDate.get(incoming.date)
            const merged = {
              ...(existing ?? defaultDraft(incoming.date)),
              ...incoming,
              date: incoming.date,
              id: incoming.id ?? existing?.id ?? incoming.date,
              symptoms: splitEmojiSequence(
                Array.isArray(incoming.symptoms)
                  ? incoming.symptoms.join('')
                  : Array.isArray(existing?.symptoms)
                    ? existing.symptoms.join('')
                    : incoming.emoji ?? existing?.emoji ?? ''
              ),
            }
            merged.emoji = primaryEmojiFromSymptoms(merged.symptoms)
            merged.estrogen = Number.isFinite(Number(merged.estrogen))
              ? Number(merged.estrogen)
              : 0.7
            merged.fog = Number.isFinite(Number(merged.fog)) ? Number(merged.fog) : 0.4
            merged.color = merged.color || defaultDraft(incoming.date).color
            merged.updatedAt = new Date().toISOString()
            byDate.set(incoming.date, merged)
          }

          return {
            entries: [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date)),
          }
        }),

      getEntryByDate: (date) => get().entries.find((entry) => entry.date === date),

      loadDemoData: () => {
        if (get().entries.length > 0) {
          return { ok: false }
        }
        set({
          entries: [...DEMO_ENTRIES].sort((a, b) => b.date.localeCompare(a.date)),
          cycleStartDate: DEMO_CYCLE_START_DATE,
        })
        get().hydrateDraftForToday()
        return { ok: true }
      },

      deleteDataInRange: ({ startDate, endDate, scopes }) => {
        if (!startDate || !endDate || !Array.isArray(scopes) || scopes.length === 0) {
          return { ok: false, message: 'Choose a range and at least one data type.' }
        }

        const rangeStart = startDate <= endDate ? startDate : endDate
        const rangeEnd = startDate <= endDate ? endDate : startDate
        const state = get()
        const { entries: nextEntries, removedCount } = applyDeletion(
          state.entries,
          rangeStart,
          rangeEnd,
          scopes,
          defaultDraft
        )

        if (removedCount === 0) {
          return { ok: false, message: 'Nothing matched your selection.' }
        }

        const active = state.activeDate || todayKey()
        const activeInRange = active >= rangeStart && active <= rangeEnd
        const savedActive = nextEntries.find((entry) => entry.date === active)
        let draft = state.draft

        if (activeInRange) {
          if (scopes.includes('entries') || !savedActive) {
            draft = defaultDraft(active)
          } else {
            const symptoms = normalizeSymptoms(savedActive)
            draft = {
              ...savedActive,
              symptoms,
              emoji: primaryEmojiFromSymptoms(symptoms),
              fog: savedActive.fog ?? 0.4,
            }
          }
        }

        set({
          entries: nextEntries.sort((a, b) => b.date.localeCompare(a.date)),
          draft,
        })

        return {
          ok: true,
          message: `Removed data from ${removedCount} day${removedCount === 1 ? '' : 's'}.`,
        }
      },

      resetAllData: () => {
        const today = todayKey()
        set({
          entries: [],
          cycleStartDate: today,
          activeDate: today,
          draft: defaultDraft(today),
        })
        return { ok: true }
      },
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        entries: state.entries,
        cycleStartDate: state.cycleStartDate,
        activeDate: state.activeDate,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrateDraftForToday()
      },
    }
  )
)

export default useCycleStore
