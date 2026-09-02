import type { Difficulty, DifficultyConfig, Grid } from '../types/sudoku'

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    description: 'Ideal para relajarte y entrar en calor',
    clues: [38, 45],
    maxHints: 5,
  },
  medium: {
    id: 'medium',
    label: 'Medio',
    description: 'Un buen reto sin volverte loco',
    clues: [30, 36],
    maxHints: 3,
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    description: 'Solo para mentes maestras del sudoku',
    clues: [24, 29],
    maxHints: 2,
  },
}

const SIZE = 9
const BOX = 3

export function createEmptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row])
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Whether `val` can legally sit at (row, col) given the grid's current contents. */
export function isSafe(grid: Grid, row: number, col: number, val: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (grid[row][i] === val || grid[i][col] === val) return false
  }
  const br = row - (row % BOX)
  const bc = col - (col % BOX)
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      if (grid[br + r][bc + c] === val) return false
    }
  }
  return true
}

/** Fills an empty grid into a full, valid, randomized solution using backtracking. */
export function generateSolvedGrid(): Grid {
  const grid = createEmptyGrid()

  function fill(pos: number): boolean {
    if (pos === SIZE * SIZE) return true
    const row = Math.floor(pos / SIZE)
    const col = pos % SIZE
    if (grid[row][col] !== 0) return fill(pos + 1)

    for (const val of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      if (isSafe(grid, row, col, val)) {
        grid[row][col] = val
        if (fill(pos + 1)) return true
        grid[row][col] = 0
      }
    }
    return false
  }

  fill(0)
  return grid
}

/** Counts solutions of `grid` up to `limit` (stops early once reached). */
export function countSolutions(grid: Grid, limit = 2): number {
  const working = cloneGrid(grid)
  let count = 0

  function solve(pos: number): boolean {
    if (count >= limit) return true
    if (pos === SIZE * SIZE) {
      count++
      return count >= limit
    }
    const row = Math.floor(pos / SIZE)
    const col = pos % SIZE
    if (working[row][col] !== 0) return solve(pos + 1)

    for (let val = 1; val <= 9; val++) {
      if (isSafe(working, row, col, val)) {
        working[row][col] = val
        if (solve(pos + 1)) return true
        working[row][col] = 0
      }
    }
    return false
  }

  solve(0)
  return count
}

/**
 * Carves a puzzle out of a full solution by removing cells while a unique
 * solution is preserved, stopping once the clue-count target is hit.
 */
export function carvePuzzle(solution: Grid, difficulty: Difficulty): Grid {
  const puzzle = cloneGrid(solution)
  const targetClues =
    DIFFICULTIES[difficulty].clues[0] +
    Math.floor(
      Math.random() *
        (DIFFICULTIES[difficulty].clues[1] - DIFFICULTIES[difficulty].clues[0] + 1),
    )

  const cells = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, i) => ({ row: Math.floor(i / SIZE), col: i % SIZE })),
  )

  let clues = SIZE * SIZE

  for (const { row, col } of cells) {
    if (clues <= targetClues) break
    const backup = puzzle[row][col]
    if (backup === 0) continue

    puzzle[row][col] = 0
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[row][col] = backup
    } else {
      clues--
    }
  }

  return puzzle
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Grid; solution: Grid } {
  const solution = generateSolvedGrid()
  const puzzle = carvePuzzle(solution, difficulty)
  return { puzzle, solution }
}

export function isBoardComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((v) => v !== 0))
}

export function matchesSolution(grid: Grid, solution: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== solution[r][c]) return false
    }
  }
  return true
}

export function boxOf(row: number, col: number): number {
  return Math.floor(row / BOX) * BOX + Math.floor(col / BOX)
}
