import { memo, type CSSProperties, type PointerEvent } from 'react';

interface TileProps {
  position: number;
  size: number;
  /** Фон фрагмента: жёстко привязан к его месту в исходной картинке. */
  background: CSSProperties;
  isSelected: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  onPointerDown: (event: PointerEvent<HTMLDivElement>, position: number) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
}

function TileComponent({
  position,
  size,
  background,
  isSelected,
  isDragging,
  isDropTarget,
  dragOffsetX,
  dragOffsetY,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: TileProps) {
  // Едва заметная линия между фрагментами, не влияющая на размер плитки.
  const hairline = 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.12)';

  const style: CSSProperties = {
    ...background,
    width: size,
    height: size,
    touchAction: 'none',
    boxShadow: hairline,
  };

  if (isDragging) {
    style.transform = `translate3d(${dragOffsetX}px, ${dragOffsetY}px, 0) scale(1.06)`;
    style.zIndex = 30;
    style.boxShadow = `${hairline}, 0 12px 30px rgba(0, 0, 0, 0.25)`;
  }

  const outline = isDragging
    ? 'outline outline-2 outline-neutral-900'
    : isDropTarget
      ? 'outline outline-2 outline-neutral-900/60 -outline-offset-2'
      : isSelected
        ? 'outline outline-2 outline-neutral-900 -outline-offset-2'
        : '';

  return (
    <div
      role="gridcell"
      aria-label={`${position + 1}`}
      style={style}
      className={`relative cursor-pointer select-none ${outline}`}
      onPointerDown={(event) => onPointerDown(event, position)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    />
  );
}

export const Tile = memo(TileComponent);
