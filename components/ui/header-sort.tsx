import { expenseFilterPrefix } from "@/app/[locale]/(owner)/room/[id]/components/room-expense/ExpenseManagementSection";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { SortOrder } from "@/types";
import { isArray } from "lodash";
import { ChevronUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, memo, useCallback, useMemo } from "react";

interface HeaderSortProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  filterPrefix?: string;
}

const HeaderSort = ({ children, name, filterPrefix }: HeaderSortProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = useMemo(() => {
    const search = new URLSearchParams(searchParams.toString());
    const sort = search.get(`${filterPrefix ? filterPrefix + "_" : ""}sort`);
    if (!sort) return null;

    return sort.split(":");
  }, [searchParams]);

  const handleSort = useCallback(() => {
    const search = new URLSearchParams(searchParams.toString());
    if (!currentSort) {
      search.set(`${expenseFilterPrefix}_sort`, `${name}:${SortOrder.DESC}`);
    } else {
      const [, currentDirect] = currentSort;

      if (currentDirect === SortOrder.ASC) {
        search.delete(`${expenseFilterPrefix}_sort`);
      }

      if (currentDirect === SortOrder.DESC) {
        search.set(`${expenseFilterPrefix}_sort`, `${name}:${SortOrder.ASC}`);
      }
    }
    router.replace(`${pathname}?${search.toString()}`, { scroll: false });
  }, [searchParams, currentSort]);

  let currentSortName = null;
  let currentDirect = null;
  if (isArray(currentSort)) {
    [currentSortName, currentDirect] = currentSort;
  }

  return (
    <div
      className="flex gap-2 items-center hover:underline cursor-pointer"
      onClick={handleSort}
    >
      {children}
      <ChevronUp
        className={cn(
          "block transition-transform w-3 h-3",
          currentDirect === SortOrder.DESC && "rotate-180",
          (!currentDirect || currentSortName !== name) && "hidden"
        )}
      />
    </div>
  );
};

export default memo(HeaderSort);
