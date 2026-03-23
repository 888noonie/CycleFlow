import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function defaultDraft(date = todayKey()) {
  return {
    date,
    emoji: '🫥',
    symptoms: [],
    color: '#2d8a8a',
    estrogen: 0.7,
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

      setDraftField: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value },
        })),

      setCycleStartDate: (value) => set(() => ({ cycleStartDate: value })),

      hydrateDraftForToday: () =>
        set((state) => {
          const date = todayKey()
          const existing = state.entries.find((entry) => entry.date === date)
          if (!existing) {
            return { draft: defaultDraft(date) }
          }

          const symptoms = normalizeSymptoms(existing)
          return {
            draft: {
              ...existing,
              symptoms,
              emoji: primaryEmojiFromSymptoms(symptoms),
            },
          }
        }),

      saveTodayEntry: () =>
        set((state) => {
          const date = todayKey()
          const nextEntry = {
            ...state.draft,
            id: state.draft.id ?? date,
            symptoms: normalizeSymptoms(state.draft),
            emoji: primaryEmojiFromSymptoms(normalizeSymptoms(state.draft)),
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
          }
        }),

      getEntryByDate: (date) => get().entries.find((entry) => entry.date === date),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        entries: state.entries,
        cycleStartDate: state.cycleStartDate,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrateDraftForToday()
      },
    }
  )
)

export default useCycleStore
