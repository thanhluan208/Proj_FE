import DatePickerField from "@/components/common/fields/DatePickerField";
import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import SelectField from "@/components/common/fields/SelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter } from "@/i18n/routing";
import { GetBillingDto } from "@/types/billing.type";
import { GetRoomExpensesDto } from "@/types/rooms.type";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  expenseFilterKeys,
  expenseFilterPrefix,
} from "./ExpenseManagementSection";
import { BOOLEAN_OPTION, IGNORE_FILTERS_LIST } from "@/lib/constant";
import CheckBoxField from "@/components/common/fields/CheckboxField";

const ExpenseFilter = ({ id }: { id?: string }) => {
  const searchParams = useSearchParams();
  const t = useTranslations("expense");

  const [open, setOpen] = useState(false);

  const filters = useMemo<GetBillingDto>(() => {
    return expenseFilterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(
          `${expenseFilterPrefix}_${cur.key}`
        );
        return {
          ...prev,
          [cur.key]: filterValue || cur.defaultValue,
        };
      },
      {}
    ) as unknown as GetBillingDto;
  }, [searchParams]);

  const hasActiveFilters =
    Object.entries(filters).filter(
      ([key, value]) => ![...IGNORE_FILTERS_LIST].includes(key) && !!value
    ).length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button id={id} variant={hasActiveFilters ? "default" : "outline"}>
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">{t("filter.buttonText")}</span>
          {hasActiveFilters && (
            <span className="bg-primary-foreground text-primary text-xs px-1.5 py-0.5 rounded-full font-bold">
              {
                Object.entries(filters).filter(
                  ([key, value]) =>
                    !["page", "pageSize"].includes(key) && !!value
                ).length
              }
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("filter.title")}</SheetTitle>
          <SheetDescription>{t("filter.description")}</SheetDescription>
        </SheetHeader>
        {open && <ExpenseFilterContent filters={filters} setOpen={setOpen} />}
      </SheetContent>
    </Sheet>
  );
};

export default ExpenseFilter;

interface ExpenseFilterContentProps {
  filters: GetRoomExpensesDto;
  setOpen: (value: boolean) => void;
}

const ExpenseFilterContent = ({
  filters,
  setOpen,
}: ExpenseFilterContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("expense");

  const schema = z.object({
    from: z.date().optional(),
    to: z.date().optional(),
    comparison: z.string().optional(),
    search: z.string().optional(),
    amount: z.string().optional(),
    isAssetHandedOver: z.string().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: filters?.from ? dayjs(filters.from).toDate() : undefined,
      to: filters?.to ? dayjs(filters.to).toDate() : undefined,
      comparison: filters.comparison || "",
      search: filters.search || "",
      amount: filters.amount || "",
      isAssetHandedOver: filters.isAssetHandedOver || "all",
    },
  });

  const comparisonOption = useMemo(() => {
    return ["bigger", "smaller"].map((elm) => {
      return {
        label: t(`filter.comparison.${elm}`),
        value: elm,
      };
    });
  }, [t]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.append(
          `${expenseFilterPrefix}_${key}`,
          value instanceof Date ? dayjs(value).toISOString() : value.toString()
        );
      } else {
        params.delete(`${expenseFilterPrefix}_${key}`);
      }
    });

    params.set(`${expenseFilterPrefix}_page`, "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    expenseFilterKeys.forEach((key) => {
      params.delete(`${expenseFilterPrefix}_${key.key}`);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-6">
          <SelectField
            control={form.control}
            name={`isAssetHandedOver`}
            label={t("handedOver")}
            options={BOOLEAN_OPTION}
          />

          <InputField
            control={form.control}
            name="search"
            label={t("filter.search")}
            placeholder={t("filter.searchPlaceholder")}
          />

          <DatePickerField
            control={form.control}
            name="from"
            label={t("filter.fromDate")}
            placeholder={t("filter.fromDatePlaceholder")}
          />
          <DatePickerField
            control={form.control}
            name="to"
            label={t("filter.toDate")}
            placeholder={t("filter.toDatePlaceholder")}
          />

          <div className="grid grid-cols-3 gap-2">
            <SelectField
              name="comparison"
              control={form.control}
              options={comparisonOption}
              label={t("filter.comparisonLabel")}
              placeholder={t("filter.comparisonPlaceholder")}
            />
            <div className="col-span-2">
              <NumericFormatField
                rightIcon={<span className="text-muted-foreground">₫</span>}
                control={form.control}
                name="amount"
                label={t("filter.amount")}
                placeholder={t("filter.amountPlaceholder")}
              />
            </div>
          </div>
        </div>
        <SheetFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            {t("filter.reset")}
          </Button>
          <Button type="submit">{t("filter.apply")}</Button>
        </SheetFooter>
      </form>
    </Form>
  );
};
