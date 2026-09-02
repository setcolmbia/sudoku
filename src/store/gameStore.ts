import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DIFFICULTIES, generatePuzzle, isSafe } from '../engine/sudoku'
import { computeConflicts, isBoardSolved } from '../engine/validate'
import { haptics, setHapticsEnabled } from '../utils/haptics'
import { sfx, setSoundEnabled } from '../utils/sound'
import type { Difficulty, Grid } from '../types/sudoku'
import type { CellPos, GameStatus, Settings, Snapshot, StatsByDifficulty } from '../types/game'

const MAX_HISTORY = 60

function emptyBoolGrid(): boolean[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(false))
}

function emptyNotes(): boolean[][][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Array(9).fill(false)))
}

function cloneNotes(notes: boolean[][][]): boolean[][][] {
  return notes.map((row) => row.map((cell) => [...cell]))
}

function cloneValues(values: Grid): Grid {
  return values.map((row) => [...row])
}

function defaultStats(): StatsByDifficulty {
  return {
    easy: { bestTimeSec: null, gamesPlayed: 0, gamesWon: 0 },
    medium: { bestTimeSec: null, gamesPlayed: 0, gamesWon: 0 },
    hard: { bestTimeSec: null, gamesPlayed: 0, gamesWon: 0 },
  }
}

interface GameState {
  status: GameStatus
  difficulty: Difficulty

  puzzle: Grid
  solution: Grid
  values: Grid
  given: boolean[][]
  notes: boolean[][][]
  hinted: boolean[][]
  conflicts: boolean[][]

  selected: CellPos | null
  spotlight: CellPos | null
  highlightedDigit: number | null
  notesMode: boolean

  mistakes: number
  hintsUsed: number
  elapsedSec: number
  history: Snapshot[]

  settings: Settings
  stats: StatsByDifficulty

  lastErrorCell: CellPos | null
  lastPlacedCell: CellPos | null

  // actions
  newGame: (difficulty: Difficulty) => void
  resumeIfAny: () => boolean
  selectCell: (row: number, col: number) => void
  clearSelection: () => void
  setSpotlight: (pos: CellPos | null) => void
  inputDigit: (digit: number) => void
  eraseSelected: () => void
  toggleNotesMode: () => void
  toggleDigitHighlight: (digit: number) => void
  requestHint: () => void
  undo: () => void
  pause: () => void
  resume: () => void
  backToMenu: () => void
  tick: () => void
  updateSettings: (patch: Partial<Settings>) => void
}

function pushHistory(state: GameState): Snapshot[] {
  const snap: Snapshot = {
    values: cloneValues(state.values),
    notes: cloneNotes(state.notes),
    hinted: state.hinted.map((r) => [...r]),
    mistakes: state.mistakes,
  }
  const next = [...state.history, snap]
  if (next.length > MAX_HISTORY) next.shift()
  return next
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      status: 'menu',
      difficulty: 'easy',

      puzzle: [],
      solution: [],
      values: [],
      given: emptyBoolGrid(),
      notes: emptyNotes(),
      hinted: emptyBoolGrid(),
      conflicts: emptyBoolGrid(),

      selected: null,
      spotlight: null,
      highlightedDigit: null,
      notesMode: false,

      mistakes: 0,
      hintsUsed: 0,
      elapsedSec: 0,
      history: [],

      settings: {
        soundOn: true,
        hapticsOn: true,
        autoCleanNotes: true,
        highlightPeers: true,
      },
      stats: defaultStats(),

      lastErrorCell: null,
      lastPlacedCell: null,

      newGame: (difficulty) => {
        const { puzzle, solution } = generatePuzzle(difficulty)
        const given = puzzle.map((row) => row.map((v) => v !== 0))
        set({
          status: 'playing',
          difficulty,
          puzzle,
          solution,
          values: cloneValues(puzzle),
          given,
          notes: emptyNotes(),
          hinted: emptyBoolGrid(),
          conflicts: emptyBoolGrid(),
          selected: null,
          spotlight: null,
          highlightedDigit: null,
          notesMode: false,
          mistakes: 0,
          hintsUsed: 0,
          elapsedSec: 0,
          history: [],
          lastErrorCell: null,
          lastPlacedCell: null,
        })
      },

      resumeIfAny: () => {
        const s = get()
        if (s.status === 'playing' || s.status === 'paused') {
          set({ status: 'playing' })
          return true
        }
        return false
      },

      selectCell: (row, col) => {
        const s = get()
        if (s.status !== 'playing') return
        set({ selected: { row, col } })
        if (s.settings.soundOn) sfx.tap()
      },

      clearSelection: () => set({ selected: null, spotlight: null }),

      setSpotlight: (pos) => set({ spotlight: pos }),

      toggleNotesMode: () => set((s) => ({ notesMode: !s.notesMode })),

      toggleDigitHighlight: (digit) =>
        set((s) => ({ highlightedDigit: s.highlightedDigit === digit ? null : digit })),

      inputDigit: (digit) => {
        const s = get()
        if (s.status !== 'playing' || !s.selected) return
        const { row, col } = s.selected
        if (s.given[row][col]) return

        if (s.notesMode) {
          const notes = cloneNotes(s.notes)
          const turningOn = !notes[row][col][digit - 1]
          notes[row][col][digit - 1] = turningOn
          const invalid = turningOn && !isSafe(s.values, row, col, digit)

          set({
            notes,
            history: pushHistory(s),
            lastErrorCell: invalid ? { row, col } : s.lastErrorCell,
          })
          if (invalid) {
            if (s.settings.soundOn) sfx.error()
            if (s.settings.hapticsOn) haptics.error()
          } else if (s.settings.soundOn) {
            sfx.note()
          }
          return
        }

        const values = cloneValues(s.values)
        if (values[row][col] === digit) return

        const history = pushHistory(s)
        values[row][col] = digit

        const notes = cloneNotes(s.notes)
        notes[row][col] = Array(9).fill(false)
        if (s.settings.autoCleanNotes) {
          for (let i = 0; i < 9; i++) {
            notes[row][i][digit - 1] = false
            notes[i][col][digit - 1] = false
          }
          const br = row - (row % 3)
          const bc = col - (col % 3)
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              notes[br + r][bc + c][digit - 1] = false
            }
          }
        }

        const hinted = s.hinted.map((r) => [...r])
        hinted[row][col] = false

        const conflicts = computeConflicts(values)
        const isMistake = conflicts[row][col]
        const mistakes = s.mistakes + (isMistake ? 1 : 0)

        const won = isBoardSolved(values, conflicts)

        set({
          values,
          notes,
          hinted,
          conflicts,
          history,
          mistakes,
          lastErrorCell: isMistake ? { row, col } : null,
          lastPlacedCell: { row, col },
          status: won ? 'won' : s.status,
        })

        if (isMistake) {
          if (s.settings.soundOn) sfx.error()
          if (s.settings.hapticsOn) haptics.error()
        } else {
          if (s.settings.soundOn) sfx.place()
          if (s.settings.hapticsOn) haptics.place()
        }

        if (won) {
          const diff = s.difficulty
          const stats = { ...s.stats }
          const cur = stats[diff]
          const best = cur.bestTimeSec === null ? s.elapsedSec : Math.min(cur.bestTimeSec, s.elapsedSec)
          stats[diff] = { bestTimeSec: best, gamesPlayed: cur.gamesPlayed + 1, gamesWon: cur.gamesWon + 1 }
          set({ stats })
          if (s.settings.soundOn) sfx.win()
          if (s.settings.hapticsOn) haptics.win()
        }
      },

      eraseSelected: () => {
        const s = get()
        if (s.status !== 'playing' || !s.selected) return
        const { row, col } = s.selected
        if (s.given[row][col]) return
        if (s.values[row][col] === 0 && s.notes[row][col].every((n) => !n)) return

        const history = pushHistory(s)
        const values = cloneValues(s.values)
        values[row][col] = 0
        const notes = cloneNotes(s.notes)
        notes[row][col] = Array(9).fill(false)
        const hinted = s.hinted.map((r) => [...r])
        hinted[row][col] = false
        const conflicts = computeConflicts(values)

        set({ values, notes, hinted, conflicts, history, lastErrorCell: null })
        if (s.settings.soundOn) sfx.erase()
      },

      requestHint: () => {
        const s = get()
        if (s.status !== 'playing') return
        const max = DIFFICULTIES[s.difficulty].maxHints
        if (s.hintsUsed >= max) return

        let target: CellPos | null = null
        if (s.selected) {
          const { row, col } = s.selected
          if (!s.given[row][col] && s.values[row][col] !== s.solution[row][col]) {
            target = { row, col }
          }
        }
        if (!target) {
          const candidates: CellPos[] = []
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (!s.given[r][c] && s.values[r][c] !== s.solution[r][c]) candidates.push({ row: r, col: c })
            }
          }
          if (candidates.length === 0) return
          target = candidates[Math.floor(Math.random() * candidates.length)]
        }

        const { row, col } = target
        const history = pushHistory(s)
        const values = cloneValues(s.values)
        values[row][col] = s.solution[row][col]
        const notes = cloneNotes(s.notes)
        notes[row][col] = Array(9).fill(false)
        const hinted = s.hinted.map((r) => [...r])
        hinted[row][col] = true
        const conflicts = computeConflicts(values)
        const won = isBoardSolved(values, conflicts)

        set({
          values,
          notes,
          hinted,
          conflicts,
          history,
          hintsUsed: s.hintsUsed + 1,
          selected: target,
          status: won ? 'won' : s.status,
        })
        if (s.settings.soundOn) sfx.hint()
        if (s.settings.hapticsOn) haptics.tap()

        if (won) {
          const diff = s.difficulty
          const stats = { ...s.stats }
          const cur = stats[diff]
          const best = cur.bestTimeSec === null ? s.elapsedSec : Math.min(cur.bestTimeSec, s.elapsedSec)
          stats[diff] = { bestTimeSec: best, gamesPlayed: cur.gamesPlayed + 1, gamesWon: cur.gamesWon + 1 }
          set({ stats })
          if (s.settings.soundOn) sfx.win()
        }
      },

      undo: () => {
        const s = get()
        if (s.history.length === 0) return
        const prev = s.history[s.history.length - 1]
        const conflicts = computeConflicts(prev.values)
        set({
          values: prev.values,
          notes: prev.notes,
          hinted: prev.hinted,
          mistakes: prev.mistakes,
          conflicts,
          history: s.history.slice(0, -1),
        })
      },

      pause: () => set((s) => (s.status === 'playing' ? { status: 'paused' } : {})),
      resume: () => set((s) => (s.status === 'paused' ? { status: 'playing' } : {})),
      backToMenu: () => set({ status: 'menu', selected: null, spotlight: null }),

      tick: () =>
        set((s) => (s.status === 'playing' ? { elapsedSec: s.elapsedSec + 1 } : {})),

      updateSettings: (patch) => {
        const next = { ...get().settings, ...patch }
        if (patch.soundOn !== undefined) setSoundEnabled(patch.soundOn)
        if (patch.hapticsOn !== undefined) setHapticsEnabled(patch.hapticsOn)
        set({ settings: next })
      },
    }),
    {
      name: 'numi-save',
      partialize: (s) => ({
        status: s.status === 'playing' ? 'paused' : s.status,
        difficulty: s.difficulty,
        puzzle: s.puzzle,
        solution: s.solution,
        values: s.values,
        given: s.given,
        notes: s.notes,
        hinted: s.hinted,
        conflicts: s.conflicts,
        mistakes: s.mistakes,
        hintsUsed: s.hintsUsed,
        elapsedSec: s.elapsedSec,
        settings: s.settings,
        stats: s.stats,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setSoundEnabled(state.settings.soundOn)
          setHapticsEnabled(state.settings.hapticsOn)
        }
      },
    },
  ),
)
