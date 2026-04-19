import { measureElement, useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { useRef, type ReactNode } from "react";

const canMeasure =
  typeof document !== "undefined" && typeof ResizeObserver !== "undefined";

export type VirtualizedListProps<T> = {
  items: readonly T[];
  /** Initial row height hint; rows still measure when `measureElement` is available */
  estimateSize?: number | ((index: number) => number);
  /** Gap between rows (px), same as TanStack `gap` */
  gap?: number;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  /** Scroll container (ref + overflow) */
  scrollClassName?: string;
  /** Applied to each absolutely positioned row wrapper */
  rowClassName?: string;
};

export function VirtualizedList<T>({
  items,
  estimateSize = 100,
  gap = 8,
  overscan = 8,
  getItemKey,
  renderItem,
  scrollClassName,
  rowClassName,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const estimate =
    typeof estimateSize === "function" ? estimateSize : () => estimateSize;

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimate,
    gap,
    overscan,
    getItemKey: (index) => {
      const item = items[index];
      if (item === undefined) return index;
      return getItemKey?.(item, index) ?? index;
    },
    measureElement: canMeasure ? measureElement : undefined,
  });

  return (
    <div
      ref={parentRef}
      className={clsx("min-h-0 flex-1 overflow-y-auto", scrollClassName)}
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((v) => {
          const item = items[v.index];
          if (item === undefined) return null;

          return (
            <div
              key={v.key}
              data-index={v.index}
              ref={virtualizer.measureElement}
              className={clsx(
                "absolute left-0 top-0 w-full max-w-full",
                rowClassName,
              )}
              style={{ transform: `translateY(${v.start}px)` }}
            >
              {renderItem(item, v.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
