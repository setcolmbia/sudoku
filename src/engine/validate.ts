import type { Grid } from '../types/sudoku'
import { boxOf } from './sudoku'

/** Marks every non-empty cell that conflicts with a peer sharing its row/col/box. */
export function computeConflicts(values: Grid): boolean[][] {
  const conflicts = Array.from({ length: 9 }, () => Array(9).fill(false))

  const rows: number[][] = Array.from({ length: 9 }, () => [])
  const cols: number[][] = Array.from({ length: 9 }, () => [])
  const boxes: number[][] = Array.from({ length: 9 }, () => [])

  const rowPos: [number, number][][] = Array.from({ length: 9 }, () => [])
  const colPos: [number, number][][] = Array.from({ length: 9 }, () => [])
  const boxPos: [number, number][][] = Array.from({ length: 9 }, () => [])

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = values[r][c]
      if (v === 0) continue
      const b = boxOf(r, c)
      rows[r].push(v)
      cols[c].push(v)
      boxes[b].push(v)
      rowPos[r].push([r, c])
      colPos[c].push([r, c])
      boxPos[b].push([r, c])
    }
  }

  function flagDupes(group: number[], positions: [number, number][]) {
    const seen = new Map<number, number>()
    for (const v of group) seen.set(v, (seen.get(v) ?? 0) + 1)
    positions.forEach(([r, c]) => {
      const v = values[r][c]
      if ((seen.get(v) ?? 0) > 1) conflicts[r][c] = true
    })
  }

  for (let i = 0; i < 9; i++) {
    flagDupes(rows[i], rowPos[i])
    flagDupes(cols[i], colPos[i])
    flagDupes(boxes[i], boxPos[i])
  }

  return conflicts
}

export function isBoardSolved(values: Grid, conflicts: boolean[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (values[r][c] === 0 || conflicts[r][c]) return false
    }
  }
  return true
}
