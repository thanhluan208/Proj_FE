import { usePathname, useRouter } from "@/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

interface PaginationProps {
  total?: number;
  prefixName?: string;
}

const Pagination: React.FC<PaginationProps> = ({ total, prefixName }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(
    searchParams.get(prefixName ? `${prefixName}_page` : "page") || 1
  );
  const pageSize = Number(
    searchParams.get(prefixName ? `${prefixName}_pageSize` : "pageSize") || 10
  );

  const handleChangePage = (page: number) => {
    const search = new URLSearchParams(searchParams);
    search.set(prefixName ? `${prefixName}_page` : "page", page.toString());

    router.push(`${pathname}?${search.toString()}`, { scroll: false });
  };

  const totalPages = total ? Math.ceil(total / pageSize) : 1;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => handleChangePage(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg bg-accent/50 dark:bg-accent/30 text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((elm) => {
          // Show first page, last page, current page, and pages around current
          const showPage =
            elm === 1 ||
            elm === totalPages ||
            (elm >= page - 1 && elm <= page + 1);

          if (!showPage) {
            // Show ellipsis
            if (elm === page - 2 || elm === page + 2) {
              return (
                <span key={page} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }
            return null;
          }

          return (
            <button
              key={elm}
              onClick={() => handleChangePage(elm)}
              className={`min-w-10 px-3 py-2 rounded-lg font-medium transition-all ${
                page === elm
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/50 dark:bg-accent/30 text-foreground hover:bg-accent"
              }`}
            >
              {elm}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handleChangePage(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg bg-accent/50 dark:bg-accent/30 text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
