import DatePickerField from "@/components/common/fields/DatePickerField";
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
import { BillingStatusEnum, GetBillingDto } from "@/types/billing.type";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { billingFilterKeys, recBillFilterPrefix } from "./BillingInfo";
import { isEmpty } from "lodash";
import { IGNORE_FILTERS_LIST } from "@/lib/constant";

const BillingFilter = ({ id }: { id?: string }) => {
  const searchParams = useSearchParams();
  const t = useTranslations("bill");

  const [open, setOpen] = useState(false);

  const filters = useMemo<GetBillingDto>(() => {
    return billingFilterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(
          `${recBillFilterPrefix}_${cur.key}`
        );
        return {
          ...prev,
          [cur.key]: filterValue || cur.defaultValue,
        };
      },
      {}
    ) as unknown as GetBillingDto;
  }, [searchParams]);

  console.log("filter", filters);

  const hasActiveFilters =
    Object.entries(filters).filter(
      ([key, value]) =>
        !["type", ...IGNORE_FILTERS_LIST].includes(key) && !!value
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
        {open && <BillingFilterContent filters={filters} setOpen={setOpen} />}
      </SheetContent>
    </Sheet>
  );
};

export default BillingFilter;

interface BillingFilterContentProps {
  filters: GetBillingDto;
  setOpen: (value: boolean) => void;
}

const BillingFilterContent = ({
  filters,
  setOpen,
}: BillingFilterContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("bill");

  const schema = z.object({
    from: z.date().optional(),
    to: z.date().optional(),
    status: z.string().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: filters?.from ? dayjs(filters.from).toDate() : undefined,
      to: filters?.to ? dayjs(filters.to).toDate() : undefined,
      status: filters.status || "",
    },
  });

  const statusOption = useMemo(() => {
    return Object.values(BillingStatusEnum).map((elm) => {
      return {
        label: t(`status.${elm}`),
        value: elm,
      };
    });
  }, [t]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.append(
          `${recBillFilterPrefix}_${key}`,
          value instanceof Date ? dayjs(value).toISOString() : value
        );
      } else {
        params.delete(`${recBillFilterPrefix}_${key}`);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    billingFilterKeys.forEach((key) => {
      console.log("delete", `${recBillFilterPrefix}_${key}`);
      params.delete(`${recBillFilterPrefix}_${key.key}`);
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

          <SelectField
            name="status"
            control={form.control}
            options={statusOption}
            label={t("filter.status")}
            placeholder={t("filter.statusPlaceholder")}
          />
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
