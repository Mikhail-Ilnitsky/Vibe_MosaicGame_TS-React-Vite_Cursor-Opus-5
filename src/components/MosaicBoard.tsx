import { useCallback, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { BoardOrder } from '../lib/shuffle';
import { tileBackgroundStyle, type GridSpec } from '../lib/grid';
import { Tile } from './Tile';

interface MosaicBoardProps {
  grid: GridSpec;
  url: string;
  order: BoardOrder;
  /** Отображаемая сторона фрагмента в CSS-пикселях. */
  tileSize: number;
  selected: number | null;
  onSelect: (position: number | null) => void;
  onSwap: (a: number, b: number) => void;
  locked: boolean;
  flashing: boolean;
}

interface DragState {
  pointerId: number;
  from: number;
  startX: number;
  startY: number;
  active: boolean;
  offsetX: number;
  offsetY: number;
  over: number | null;
}

export function MosaicBoard({
  grid,
  url,
  order,
  tileSize,
  selected,
  onSelect,
  onSwap,
  locked,
  flashing,
}: MosaicBoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  // Фон каждого фрагмента считается один раз: при перемешивании он не меняется.
  const backgrounds = useMemo(
    () => Array.from({ length: grid.count }, (_, tileId) => tileBackgroundStyle(grid, url, tileId)),
    [grid, url],
  );

  const positionFromPoint = useCallback(
    (clientX: number, clientY: number): number | null => {
      const board = boardRef.current;
      if (!board) return null;
      const rect = board.getBoundingClientRect();
      const col = Math.floor((clientX - rect.left) / tileSize);
      const row = Math.floor((clientY - rect.top) / tileSize);
      if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return null;
      return row * grid.cols + col;
    },
    [grid.cols, grid.rows, tileSize],
  );

  const handleTap = useCallback(
    (position: number) => {
      if (selected === null) {
        onSelect(position);
        return;
      }
      if (selected === position) {
        onSelect(null);
        return;
      }
      onSwap(selected, position);
      onSelect(null);
    },
    [onSelect, onSwap, selected],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>, position: number) => {
      if (locked || dragRef.current) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      event.currentTarget.setPointerCapture(event.pointerId);
      const state: DragState = {
        pointerId: event.pointerId,
        from: position,
        startX: event.clientX,
        startY: event.clientY,
        active: false,
        offsetX: 0,
        offsetY: 0,
        over: null,
      };
      dragRef.current = state;
      setDrag(state);
    },
    [locked],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const state = dragRef.current;
      if (!state || state.pointerId !== event.pointerId) return;

      const offsetX = event.clientX - state.startX;
      const offsetY = event.clientY - state.startY;
      // Порог перетаскивания — половина стороны плитки.
      const active = state.active || Math.hypot(offsetX, offsetY) > tileSize / 2;
      if (!active) return;

      const next: DragState = {
        ...state,
        active: true,
        offsetX,
        offsetY,
        over: positionFromPoint(event.clientX, event.clientY),
      };
      dragRef.current = next;
      setDrag(next);
    },
    [positionFromPoint, tileSize],
  );

  const finishDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
      const state = dragRef.current;
      if (!state || state.pointerId !== event.pointerId) return;

      dragRef.current = null;
      setDrag(null);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (cancelled || locked) return;

      if (!state.active) {
        handleTap(state.from);
        return;
      }

      const target = positionFromPoint(event.clientX, event.clientY);
      if (target !== null && target !== state.from) {
        onSwap(state.from, target);
      }
      onSelect(null);
    },
    [handleTap, locked, onSelect, onSwap, positionFromPoint],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => finishDrag(event, false),
    [finishDrag],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => finishDrag(event, true),
    [finishDrag],
  );

  return (
    <div
      ref={boardRef}
      role="grid"
      // Светлая подложка видна на месте плитки, которую сейчас перетаскивают.
      className="relative grid bg-neutral-50"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${grid.rows}, ${tileSize}px)`,
        width: grid.cols * tileSize,
        height: grid.rows * tileSize,
      }}
    >
      {order.map((tileId, position) => {
        const isDragging = drag?.active === true && drag.from === position;
        return (
          <Tile
            key={tileId}
            position={position}
            size={tileSize}
            background={backgrounds[tileId]}
            isSelected={selected === position}
            isDragging={isDragging}
            isDropTarget={drag?.active === true && drag.over === position && drag.from !== position}
            dragOffsetX={isDragging ? drag.offsetX : 0}
            dragOffsetY={isDragging ? drag.offsetY : 0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />
        );
      })}

      {flashing && (
        <div className="animate-flash pointer-events-none absolute inset-0 z-40 bg-yellow-300" />
      )}
    </div>
  );
}
