"use client";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  InitialTableState,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { CSSProperties, Fragment, useState } from "react";

interface CommonTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  initialState?: InitialTableState;
}

export function CommonTable<TData, TValue>({
  columns,
  data,
  renderSubComponent,
  getRowCanExpand,
  initialState,
}: CommonTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand,
    initialState,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    setIsScrolledLeft(scrollLeft > 0);
    setIsScrolledRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned();

    const isLastLeft = isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRight =
      isPinned === "right" && column.getIsFirstColumn("right");

    return {
      boxShadow:
        isLastLeft && isScrolledLeft
          ? "-4px 0 4px -4px gray inset"
          : isFirstRight && isScrolledRight
          ? "4px 0 4px -4px gray inset"
          : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      opacity: isPinned ? 1 : 1,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  return (
    <div
      className="w-full max-w-full overflow-x-auto rounded-xl border border-border"
      onScroll={handleScroll}
    >
      <table className="min-w-max w-full">
        <thead className="bg-accent/50 dark:bg-accent/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider bg-accent/50 dark:bg-accent/30 backdrop-blur-sm"
                    style={{ ...getCommonPinningStyles(header.column) }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-accent/30 dark:hover:bg-accent/20 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned();
                    return (
                      <td
                        key={cell.id}
                        className={`px-4 py-4 whitespace-nowrap ${
                          isPinned
                            ? "bg-card! group-hover:bg-accent/30 dark:group-hover:bg-accent/20"
                            : ""
                        }`}
                        style={{ ...getCommonPinningStyles(cell.column) }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent?.({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
