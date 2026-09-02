import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { boxOf } from '../engine/sudoku'
import { Cell } from './Cell'
import type { CellPos } from '../types/game'

export function Board() {
  const values = useGameStore((s) => s.values)
  const given = useGameStore((s) => s.given)
  const notes = useGameStore((s) => s.notes)
  const hinted = useGameStore((s) => s.hinted)
  const conflicts = useGameStore((s) => s.conflicts)
  const selected = useGameStore((s) => s.selected)
  const spotlight = useGameStore((s) => s.spotlight)
  const highlightedDigit = useGameStore((s) => s.highlightedDigit)
  const highlightPeers = useGameStore((s) => s.settings.highlightPeers)
  const lastErrorCell = useGameStore((s) => s.lastErrorCell)
  const selectCell = useGameStore((s) => s.selectCell)
  const setSpotlight = useGameStore((s) => s.setSpotlight)

  const [shakeCell, setShakeCell] = useState<CellPos | null>(null)
  const shakeTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!lastErrorCell) return
    setShakeCell(lastErrorCell)
    if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
    shakeTimer.current = window.setTimeout(() => setShakeCell(null), 450)
    return () => {
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current)
    }
  }, [lastErrorCell])

  const onTap = useCallback((row: number, col: number) => selectCell(row, col), [selectCell])
  const onLongPress = useCallback(
    (row: number, col: number) => {
      selectCell(row, col)
      setSpotlight({ row, col })
    },
    [selectCell, setSpotlight],
  )
  const onRelease = useCallback(() => setSpotlight(null), [setSpotlight])

  if (values.length === 0) return null

  return (
    <div
      className="mx-auto grid aspect-square w-full max-w-[min(92vw,520px)] grid-cols-9 grid-rows-9 overflow-hidden rounded-2xl border-2 border-white/10 bg-bg-800 shadow-panel"
      style={{ touchAction: 'none' }}
    >
      {values.map((rowArr, row) =>
        rowArr.map((value, col) => {
          const box = boxOf(row, col)
          const isSelected = selected?.row === row && selected?.col === col
          const isPeer =
            highlightPeers &&
            !!selected &&
            !isSelected &&
            (selected.row === row || selected.col === col || boxOf(selected.row, selected.col) === box)
          const isSpotlighted =
            !!spotlight && !isSelected && (spotlight.row === row || spotlight.col === col)

          return (
            <Cell
              key={`${row}-${col}`}
              row={row}
              col={col}
              value={value}
              given={given[row][col]}
              hinted={hinted[row][col]}
              error={conflicts[row][col]}
              notes={notes[row][col]}
              selected={isSelected}
              spotlighted={isSpotlighted}
              peer={isPeer}
              highlightedDigit={highlightedDigit}
              shake={shakeCell?.row === row && shakeCell?.col === col}
              boxShade={box % 2 === 1}
              onTap={onTap}
              onLongPress={onLongPress}
              onRelease={onRelease}
            />
          )
        }),
      )}
    </div>
  )
}
