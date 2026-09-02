import type { Difficulty } from './sudoku'

export type GameStatus = 'menu' | 'playing' | 'paused' | 'won'

export interface CellPos {
  row: number
  col: number
}

export interface Snapshot {
  values: number[][]
  notes: boolean[][][]
  hinted: boolean[][]
  mistakes: number
}

export interface DifficultyStats {
  bestTimeSec: number | null
  gamesPlayed: number
  gamesWon: number
}

export type StatsByDifficulty = Record<Difficulty, DifficultyStats>

export interface Settings {
  soundOn: boolean
  hapticsOn: boolean
  autoCleanNotes: boolean
  highlightPeers: boolean
}
