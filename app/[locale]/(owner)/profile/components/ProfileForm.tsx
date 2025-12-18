"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import InputField from "@/components/common/fields/InputField";
import { Button } from "@/components/ui/button";
import { SpinIcon } from "@/components/icons";
import { updateProfile } from "../../../../../server/user";
import { STATUS_CODE } from "@/types";
import toast from "react-hot-toast";
import { Profile } from "@/types/authentication.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Building2 } from "lucide-react";

interface ProfileFormProps {
  initialData: Profile;
}

const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const t = useTranslations("profile");
  const vt = useTranslations("auth.validation");
  const ct = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const profileSchema = z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: vt("fullNameRequired") })
      .max(100, { message: vt("fullNameLength") }),
    email: z.string().optional(),
    phoneNumber: z.string().trim().optional().or(z.literal("")),
    bankAccountName: z.string().trim().optional().or(z.literal("")),
    bankAccountNumber: z.string().trim().optional().or(z.literal("")),
    bankName: z.string().trim().optional().or(z.literal("")),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      email: initialData.email || "",
      phoneNumber: initialData.phoneNumber || "",
      bankAccountName: initialData.bankAccountName || "",
      bankAccountNumber: initialData.bankAccountNumber || "",
      bankName: initialData.bankName || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    startTransition(async () => {
      try {
        const { email, ...updateData } = data;
        const response = await updateProfile(updateData);

        if (response.status === STATUS_CODE.SUCCESS) {
          toast.success(response.message || ct("messages.updateSuccess"));
        } else {
          toast.error(response.message || ct("messages.updateError"));
        }
      } catch (error) {
        console.error("Update profile error:", error);
        toast.error(ct("error"));
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>{t("personalInfo")}</CardTitle>
              </div>
              <CardDescription>{t("subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  control={form.control}
                  name="fullName"
                  label={t("fullName")}
                  placeholder={t("fullNamePlaceholder")}
                />
                <InputField
                  control={form.control}
                  name="email"
                  label={t("email")}
                  disabled
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  control={form.control}
                  name="phoneNumber"
                  label={t("phoneNumber")}
                  placeholder={t("phoneNumberPlaceholder")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{t("bankInfo")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  control={form.control}
                  name="bankName"
                  label={t("bankName")}
                  placeholder={t("bankNamePlaceholder")}
                />
                <InputField
                  control={form.control}
                  name="bankAccountName"
                  label={t("bankAccountName")}
                  placeholder={t("bankAccountNamePlaceholder")}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  control={form.control}
                  name="bankAccountNumber"
                  label={t("bankAccountNumber")}
                  placeholder={t("bankAccountNumberPlaceholder")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? <SpinIcon /> : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
