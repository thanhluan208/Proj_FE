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
import { Link, useRouter } from "@/i18n/routing";
import { Routes, VERIFY_OTP_COOLDOWN, VERIFY_OTP_KEY } from "@/lib/constant";
import { registerAction } from "@/server/auth";
import { STATUS_CODE } from "@/types";
import toast from "react-hot-toast";

const Register = () => {
  // Initialize translations hook for authentication context
  const t = useTranslations("auth");
  const ct = useTranslations("common");

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // Create comprehensive validation schema matching the DTO requirements
  const registerSchema = z
    .object({
      // Email validation with transformation and required validation
      email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, { message: t("validation.emailRequired") })
        .email({ message: t("validation.invalidEmail") }),

      // Password validation matching DTO requirements (8-128 chars with complexity)
      password: z
        .string()
        .min(1, { message: t("validation.passwordRequired") })
        .min(8, { message: t("validation.passwordMinLength") })
        .max(128, { message: t("validation.passwordMaxLength") })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          { message: t("validation.passwordPattern") }
        ),

      // Confirm password validation with matching check
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmPasswordRequired") }),

      // Full name validation with trimming and pattern matching
      fullName: z
        .string()
        .trim()
        .min(1, { message: t("validation.fullNameRequired") })
        .min(1, { message: t("validation.fullNameLength") })
        .max(100, { message: t("validation.fullNameLength") })
        .regex(/^[a-zA-Z\s'-]+$/, {
          message: t("validation.fullNamePattern"),
        }),

      // Optional phone number validation with space removal and international format
    })
    .refine(
      (data) => {
        // Custom validation to ensure passwords match
        return data.password === data.confirmPassword;
      },
      {
        // Set error message and path for password mismatch
        message: t("validation.passwordsDoNotMatch"),
        path: ["confirmPassword"], // This will show the error on confirmPassword field
      }
    );

  // Type inference from schema for form data
  type RegisterFormData = z.infer<typeof registerSchema>;

  // Initialize form with react-hook-form and zod validation
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  // Handle form submission with data transformation and logging
  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        // Transform data according to DTO requirements (exclude confirmPassword)
        const payload = {
          email: data.email.toLowerCase().trim(),
          password: data.password,
          fullName: data.fullName.trim(),
          // Remove spaces from phone number if provided
          provider: "email", // Default provider as per DTO
        };

        // Log the request payload as requested
        console.log("Registration payload:", payload);

        // Here you would typically call your registration API
        const response = await registerAction(payload);

        if (response.status === STATUS_CODE.SUCCESS) {
          toast.success(response?.message || ct("success"));
          router.push({
            pathname: Routes.VERIFY_OTP,
            query: { email: payload.email },
          });
          localStorage.setItem(VERIFY_OTP_KEY, VERIFY_OTP_COOLDOWN.toString());
        } else {
          toast.error(response?.message || ct("error"));
          return;
        }

        // Simulate successful registration for demo
        console.log("Registration would be processed with payload above");
      } catch (error) {
        // Handle unexpected errors
        console.error("Registration error:", error);
      }
    });
  };

  return (
    <Form {...registerForm}>
      <div className="sm:w-[500px] sm:m-auto sm:max-w-[500px] backdrop:blur-sm rounded-xl p-3 bg-[rgba(255,255,255,0.1)] shadow-2xl">
        <form
          onSubmit={registerForm.handleSubmit(onSubmit)}
          className="w-full bg-[rgba(255,255,255,0.5)] backdrop:blur-sm rounded-[14px] p-5 pt-10 flex flex-col gap-5"
        >
          {/* Registration form header with localized title and subtitle */}
          <div>
            <p className="text-center text-2xl font-semibold">
              {t("register.title")}
            </p>
            <p className="text-center text-neutral-50 font-medium">
              {t("register.subtitle")}
            </p>
          </div>

          {/* Name fields in a responsive grid layout */}
          <div className="grid grid-cols-1 gap-4">
            <InputField
              control={registerForm.control}
              name="fullName"
              label={t("register.fullName")}
              placeholder={t("register.placeholders.fullName")}
            />
          </div>

          {/* Email input field with localized label and placeholder */}
          <InputField
            control={registerForm.control}
            name="email"
            label={t("register.email")}
            type="email"
            placeholder={t("register.placeholders.email")}
          />

          {/* Password fields with validation and placeholders */}
          <InputField
            control={registerForm.control}
            name="password"
            label={t("register.password")}
            type="password"
            placeholder={t("register.placeholders.password")}
          />

          <InputField
            control={registerForm.control}
            name="confirmPassword"
            label={t("register.confirmPassword")}
            type="password"
            placeholder={t("register.placeholders.confirmPassword")}
          />

          {/* Submit button with loading state and localized text */}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <SpinIcon /> : t("register.registerButton")}
          </Button>

          {/* Divider with localized text */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 border-t border-neutral-30" />
            <p className="text-sm">{t("register.orContinueWith")}</p>
            <div className="flex-1 border-t border-neutral-30" />
          </div>

          {/* Social registration buttons with localized labels */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="w-full">
              {t("register.google")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("register.facebook")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("register.twitter")}
            </Button>
          </div>
        </form>

        {/* Sign in link with localized text */}
        <p className="mt-5 text-center">
          {t("register.haveAccount")}{" "}
          <Link
            href={Routes.LOGIN}
            className="text-secondary-50 hover:underline"
          >
            {t("register.signIn")}
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default Register;
