"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import InputField from "@/components/common/fields/InputField";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/server/auth";
import { SpinIcon } from "@/components/icons";
import { STATUS_CODE } from "@/types";
import toast from "react-hot-toast";
import { Link, useRouter } from "@/i18n/routing";
import { Routes } from "@/lib/constant";

const Login = () => {
  // Initialize translations hook for authentication context
  const t = useTranslations("auth");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // Create localized validation schema using translation keys
  const loginSchema = z.object({
    email: z.string().refine(
      (email) => {
        // Email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      {
        // Use localized error message for invalid email
        message: t("validation.invalidEmail"),
      }
    ),
    password: z
      .string()
      .refine((password) => password.length >= 8, {
        // Use localized error message for minimum password length
        message: t("validation.passwordMinLength"),
      })
      .refine((password) => password.length <= 32, {
        // Use localized error message for maximum password length
        message: t("validation.passwordMaxLength"),
      }),
  });

  // Initialize form with react-hook-form and zod validation
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission with error handling and loading state
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        // Call login action with form data
        const response = await loginAction({
          email: data.email,
          password: data.password,
        });

        if (response.status === STATUS_CODE.SUCCESS) {
          toast.success(response.message);

          router.push(Routes.ROOT);
        } else {
          console.log("Login failed:", response.message);
          // Display error message, fallback to localized generic message
          toast.error(response.message || t("validation.loginFailed"));
          return;
        }

        // Login success handling would go here
      } catch (error) {
        // Handle unexpected errors with localized message
        console.error("Login error:", error);
        toast.error(t("validation.loginFailed"));
      }
    });
  };

  console.log("re-render form wrapper");

  return (
    <Form {...loginForm}>
      <div className="w-full max-w-[500px] backdrop-blur-md rounded-2xl p-4 bg-white/10 shadow-2xl mx-auto border border-white/20">
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="w-full bg-white/40 backdrop-blur-lg rounded-xl p-6 pt-10 flex flex-col gap-5"
        >
          {/* Login form header with localized title and subtitle */}
          <div>
            <p className="text-center text-2xl font-semibold">
              {t("login.title")}
            </p>
            <p className="text-center text-neutral-50 font-medium">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Email input field with localized label */}
          <InputField
            control={loginForm.control}
            name="email"
            label={t("login.email")}
          />

          {/* Password input field with forgot password link */}
          <div className="flex flex-col gap-1.5">
            <InputField
              control={loginForm.control}
              name="password"
              label={t("login.password")}
              type="password"
            />
            {/* Forgot password link with localized text */}
            <p className="text-sm text-right">
              {t("login.forgotPassword")}{" "}
              <a href="#" className="text-secondary-50">
                {t("login.resetPassword")}
              </a>
            </p>
          </div>

          {/* Submit button with loading state and localized text */}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <SpinIcon /> : t("login.signInButton")}
          </Button>

          {/* Divider with localized text */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 border-t border-neutral-30" />
            <p className="text-sm">{t("login.orContinueWith")}</p>
            <div className="flex-1 border-t border-neutral-30" />
          </div>

          {/* Social login buttons with localized labels */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="w-full">
              {t("login.google")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("login.facebook")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("login.twitter")}
            </Button>
          </div>
        </form>

        {/* Sign up link with localized text */}
        <p className="mt-5 text-center text-white/90">
          {t("login.noAccount")}{" "}
          <Link
            href={Routes.REGISTER}
            className="text-primary-50 hover:underline font-semibold"
          >
            {t("login.signUp")}
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default Login;
