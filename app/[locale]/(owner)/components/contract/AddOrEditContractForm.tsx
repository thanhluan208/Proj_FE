import ComboBoxTenantField from "@/components/common/fields/ComboBoxTenantField";
import DatePickerField from "@/components/common/fields/DatePickerField";
import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ButtonCancel from "@/components/ui/button-cancel";
import ButtonSubmit from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { FC, memo, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import z from "zod";

interface AddOrEditContractFormProps {
  setIsDialogOpen: (open: boolean) => void;
  roomId: string;
}

const AddOrEditContractForm: FC<AddOrEditContractFormProps> = ({
  roomId,
  setIsDialogOpen,
}) => {
  const t = useTranslations("contract");
  const roomTrans = useTranslations("room");
  const tCommon = useTranslations("common");
  const { createContract } = useContractMutation();

  const isPending = createContract.isPending;

  const handleCancel = () => setIsDialogOpen(false);

  const contractSchema = z
    .object({
      // General
      createdDate: z.date(),
      startDate: z.date(),
      endDate: z.date(),
      tenants: z.array(z.string()).min(1, t("validation.minTenant")),
      // House Info
      houseAddress: z.string().optional(),
      houseOwner: z.string().optional(),
      houseOwnerPhoneNumber: z.string().optional(),
      houseOwnerBackupPhoneNumber: z.string().optional(),
      overRentalFee: z.string().optional(),
      // Bank Info
      bankAccountName: z.string().optional(),
      bankAccountNumber: z.string().optional(),
      bankName: z.string().optional(),
      // Fee Info
      base_rent: z.string().refine((value) => Number(value) > 1, {
        message: tCommon("requiredField", {
          field: roomTrans("addRoom.baseRent"),
        }),
      }),
      price_per_electricity_unit: z.string().optional(),
      price_per_water_unit: z.string().optional(),
      fixed_water_fee: z.string().optional(),
      fixed_electricity_fee: z.string().optional(),
      living_fee: z.string().optional(),
      parking_fee: z.string().optional(),
      cleaning_fee: z.string().optional(),
      internet_fee: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const {
        createdDate,
        startDate,
        endDate,
        fixed_electricity_fee,
        price_per_electricity_unit,
        fixed_water_fee,
        price_per_water_unit,
      } = data;

      if (
        Number(fixed_electricity_fee) <= 0 &&
        Number(price_per_electricity_unit) <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fixed_electricity_fee"],
          message: t("validation.eitherFieldGreaterThanZero", {
            fieldB: roomTrans("addRoom.pricePerElectricityUnit"),
            fieldA: roomTrans("addRoom.fixedElectricityFee"),
          }),
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price_per_electricity_unit"],
          message: t("validation.eitherFieldGreaterThanZero", {
            fieldA: roomTrans("addRoom.pricePerElectricityUnit"),
            fieldB: roomTrans("addRoom.fixedElectricityFee"),
          }),
        });
      }

      if (Number(fixed_water_fee) <= 0 && Number(price_per_water_unit) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fixed_water_fee"],
          message: t("validation.eitherFieldGreaterThanZero", {
            fieldB: roomTrans("addRoom.pricePerWaterUnit"),
            fieldA: roomTrans("addRoom.fixedWaterFee"),
          }),
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price_per_water_unit"],
          message: t("validation.eitherFieldGreaterThanZero", {
            fieldA: roomTrans("addRoom.pricePerWaterUnit"),
            fieldB: roomTrans("addRoom.fixedWaterFee"),
          }),
        });
      }

      // End must be AFTER created date
      if (endDate <= createdDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: t("validation.endAfterCreated"),
        });
      }

      // End must be AFTER start
      if (endDate <= startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: t("validation.endAfterStart"),
        });
      }

      // Start must be BEFORE end (redundant but clearer)
      if (startDate >= endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["startDate"],
          message: t("validation.startBeforeEnd"),
        });
      }
    });

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      createdDate: new Date(),
      startDate: new Date(),
      endDate: dayjs().add(1, "year").toDate(),
      tenants: [],
      houseAddress: "",
      houseOwner: "",
      houseOwnerPhoneNumber: "",
      houseOwnerBackupPhoneNumber: "",
      overRentalFee: "0",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
      base_rent: "0",
      cleaning_fee: "0",
      fixed_electricity_fee: "0",
      fixed_water_fee: "0",
      living_fee: "0",
      parking_fee: "0",
      price_per_electricity_unit: "0",
      price_per_water_unit: "0",
      internet_fee: "0",
    },
  });

  const onSubmit = (value: z.infer<typeof contractSchema>) => {
    const payload = {
      roomId: roomId,
      startDate: value.startDate.toISOString(),
      endDate: value.endDate.toISOString(),
      createdDate: dayjs().toISOString(),
      tenants: value.tenants,
      houseInfo: {
        houseAddress: value.houseAddress,
        houseOwner: value.houseOwner,
        houseOwnerPhoneNumber: value.houseOwnerPhoneNumber,
        houseOwnerBackupPhoneNumber: value.houseOwnerBackupPhoneNumber,
      },
      bankInfo: {
        bankAccountName: value.bankAccountName,
        bankAccountNumber: value.bankAccountNumber,
        bankName: value.bankName,
      },
      feeInfo: {
        base_rent: value.base_rent,
        cleaning_fee: value.cleaning_fee,
        fixed_electricity_fee: value.fixed_electricity_fee,
        fixed_water_fee: value.fixed_water_fee,
        living_fee: value.living_fee,
        parking_fee: value.parking_fee,
        price_per_electricity_unit: value.price_per_electricity_unit,
        price_per_water_unit: value.price_per_water_unit,
        overRentalFee: value.overRentalFee,
        internet_fee: value.internet_fee,
      },
    };

    createContract.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormEffect />

        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["general", "houseInfo", "bankInfo", "feeInfo"]}
        >
          <AccordionItem value="general">
            <AccordionTrigger className="text-lg hover:no-underline cursor-pointer mt-0 pt-0">
              General
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="grid md:grid-cols-2 gap-3 px-2">
                <ComboBoxTenantField
                  control={form.control}
                  name="tenants"
                  roomId={roomId}
                  placeholder={t("form.tenantsPlaceholder")}
                  label={t("form.tenants")}
                  isMultiple
                />

                <DatePickerField
                  startMonth={dayjs()
                    .subtract(1, "year")
                    .startOf("year")
                    .toDate()}
                  endMonth={dayjs().add(1, "year").endOf("year").toDate()}
                  control={form.control}
                  name="createdDate"
                  placeholder={t("form.createdDatePlaceholder")}
                  label={t("form.createdDate")}
                />

                <DatePickerField
                  startMonth={dayjs()
                    .subtract(1, "year")
                    .startOf("year")
                    .toDate()}
                  endMonth={dayjs().add(1, "year").endOf("year").toDate()}
                  control={form.control}
                  name="startDate"
                  placeholder={t("form.startDatePlaceholder")}
                  label={t("form.startDate")}
                />

                <DatePickerField
                  startMonth={dayjs()
                    .subtract(1, "year")
                    .startOf("year")
                    .toDate()}
                  endMonth={dayjs().add(1, "year").endOf("year").toDate()}
                  control={form.control}
                  name="endDate"
                  placeholder={t("form.endDatePlaceholder")}
                  label={t("form.endDate")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="houseInfo">
            <AccordionTrigger className="text-lg hover:no-underline cursor-pointer mt-0 ">
              House Info
            </AccordionTrigger>

            <AccordionContent className="px-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-3 px-2">
                <InputField
                  control={form.control}
                  name="houseAddress"
                  label={t("form.houseAddress")}
                  placeholder={t("form.houseAddressPlaceholder")}
                />
                <InputField
                  control={form.control}
                  name="houseOwner"
                  label={t("form.houseOwner")}
                  placeholder={t("form.houseOwnerPlaceholder")}
                />

                <InputField
                  control={form.control}
                  name="houseOwnerPhoneNumber"
                  label={t("form.houseOwnerPhoneNumber")}
                  placeholder={t("form.houseOwnerPhoneNumberPlaceholder")}
                  type="number"
                  maxLength={10}
                />

                <InputField
                  control={form.control}
                  name="houseOwnerBackupPhoneNumber"
                  label={t("form.houseOwnerBackupPhoneNumber")}
                  placeholder={t("form.houseOwnerBackupPhoneNumberPlaceholder")}
                  type="number"
                  maxLength={10}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="bankInfo">
            <AccordionTrigger className="text-lg hover:no-underline cursor-pointer mt-0 ">
              Bank Info
            </AccordionTrigger>

            <AccordionContent className="px-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-3 px-2">
                <InputField
                  control={form.control}
                  name="bankAccountName"
                  label={t("form.bankAccountName")}
                  placeholder={t("form.bankAccountNamePlaceholder")}
                />

                <InputField
                  control={form.control}
                  name="bankAccountNumber"
                  label={t("form.bankAccountNumber")}
                  placeholder={t("form.bankAccountNumberPlaceholder")}
                  type="number"
                  min={0}
                  maxLength={10}
                />

                <div className="col-span-2">
                  <InputField
                    control={form.control}
                    name="bankName"
                    label={t("form.bankName")}
                    placeholder={t("form.bankNamePlaceholder")}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="feeInfo">
            <AccordionTrigger className="text-lg hover:no-underline cursor-pointer mt-0 ">
              Fee Info
            </AccordionTrigger>

            <AccordionContent className="px-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-3 px-2">
                <NumericFormatField
                  control={form.control}
                  name="base_rent"
                  label={roomTrans("addRoom.baseRent")}
                  placeholder={roomTrans("addRoom.baseRentPlaceholder")}
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                />
                <NumericFormatField
                  control={form.control}
                  name="overRentalFee"
                  label={t("form.overRentalFee")}
                  placeholder={t("form.overRentalFeePlaceholder")}
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                />
                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="price_per_electricity_unit"
                  label={roomTrans("addRoom.pricePerElectricityUnit")}
                  placeholder={roomTrans(
                    "addRoom.pricePerElectricityUnitPlaceholder"
                  )}
                />

                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="fixed_electricity_fee"
                  label={roomTrans("addRoom.fixedElectricityFee")}
                  placeholder={roomTrans(
                    "addRoom.fixedElectricityFeePlaceholder"
                  )}
                />

                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="price_per_water_unit"
                  label={roomTrans("addRoom.pricePerWaterUnit")}
                  placeholder={roomTrans(
                    "addRoom.pricePerWaterUnitPlaceholder"
                  )}
                />

                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="fixed_water_fee"
                  label={roomTrans("addRoom.fixedWaterFee")}
                  placeholder={roomTrans("addRoom.fixedWaterFeePlaceholder")}
                />

                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="living_fee"
                  label={roomTrans("addRoom.livingFee")}
                  placeholder={roomTrans("addRoom.livingFeePlaceholder")}
                />

                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="parking_fee"
                  label={roomTrans("addRoom.parkingFee")}
                  placeholder={roomTrans("addRoom.parkingFeePlaceholder")}
                />

                <NumericFormatField
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                  control={form.control}
                  name="cleaning_fee"
                  label={roomTrans("addRoom.cleaningFee")}
                  placeholder={roomTrans("addRoom.cleaningFeePlaceholder")}
                />

                <NumericFormatField
                  control={form.control}
                  name="internet_fee"
                  label={t("form.internet_fee")}
                  placeholder={t("form.internet_feePlaceholder")}
                  rightIcon={<span className="text-muted-foreground">₫</span>}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-3 pb-6 mt-6 sticky bottom-0 bg-neutral-100 ">
          <ButtonCancel onClick={handleCancel} />

          <ButtonSubmit className="flex-1" isPending={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditContractForm;

const FormEffect = memo(() => {
  const form = useFormContext();

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    form.trigger("endDate");
  }, [startDate]);

  useEffect(() => {
    form.trigger("startDate");
  }, [endDate]);

  return null;
});
