export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Grid = number[][] // 0 = empty, 9x9

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface DifficultyConfig {
  id: Difficulty
  label: string
  description: string
  clues: [number, number] // min/max clues left on the board
  maxHints: number
}

export interface CellPosition {
  row: number
  col: number
}
