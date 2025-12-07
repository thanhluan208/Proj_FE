import { useState, useEffect } from "react";

type Breakpoints = { [key: number]: number };

export function useMasonry<T>(
  items: T[],
  breakPoints: Breakpoints = { 0: 1, 768: 2, 1024: 3 }
) {
  const [columns, setColumns] = useState<T[][]>([]);

  useEffect(() => {
    const calculateColumns = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;
      let numCols = 1;

      // Sort breakpoints descending
      const sortedBps = Object.keys(breakPoints)
        .map(Number)
        .sort((a, b) => b - a);

      for (const bp of sortedBps) {
        if (width >= bp) {
          numCols = breakPoints[bp];
          break;
        }
      }

      const newColumns: T[][] = Array.from({ length: numCols }, () => []);
      items.forEach((item, index) => {
        newColumns[index % numCols].push(item);
      });

      setColumns(newColumns);
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => window.removeEventListener("resize", calculateColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  return columns;
}
