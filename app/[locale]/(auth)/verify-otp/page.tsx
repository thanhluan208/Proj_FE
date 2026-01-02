"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SpinIcon } from "@/components/icons";
import { Link, useRouter } from "@/i18n/routing";
import { Routes, VERIFY_OTP_KEY } from "@/lib/constant";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { verifyOtpAction } from "@/server/auth";
import { STATUS_CODE } from "@/types";

const VerifyOtp = () => {
  // Initialize translations hook for authentication context
  const t = useTranslations("auth");
  const ct = useTranslations("common");
  const search = useSearchParams();
  const router = useRouter();

  const email = search.get("email") || "";

  // State management for OTP verification
  const [otpValue, setOtpValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState<boolean>(false);

  // Handle OTP input change with validation
  const handleOtpChange = (value: string) => {
    // Clear any existing errors when user starts typing
    if (error) {
      setError("");
    }

    // Update OTP value state
    setOtpValue(value);

    // Real-time validation for complete OTP
    if (value.length === 6) {
      // Validate that all characters are digits
      if (!/^\d{6}$/.test(value)) {
        setError(t("validation.otpInvalid"));
      }
    }
  };

  // Validate OTP input before submission
  const validateOtp = (): boolean => {
    // Check if OTP is empty
    if (!otpValue || otpValue.trim() === "") {
      setError(t("validation.otpRequired"));
      return false;
    }

    // Check if OTP has correct length and format
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setError(t("validation.otpInvalid"));
      return false;
    }

    return true;
  };

  // Handle OTP verification submission
  const handleVerifyOtp = () => {
    // Validate OTP before proceeding
    if (!validateOtp()) {
      return;
    }

    startTransition(async () => {
      try {
        // Prepare verification payload
        const payload = {
          otpCode: otpValue,
          email,
        };

        const response = await verifyOtpAction(payload);

        if (response.status === STATUS_CODE.SUCCESS) {
          toast.success(response?.message || ct("success"));
          router.push(Routes.LOGIN);
          localStorage.removeItem(VERIFY_OTP_KEY);
        } else {
          toast.error(response?.message || ct("error"));
          return;
        }
      } catch (error) {
        // Handle verification errors
        console.error("OTP verification error:", error);
        setError(t("validation.verificationFailed"));
        toast.error(t("validation.verificationFailed"));
      }
    });
  };

  // Handle resend OTP functionality
  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      // Clear current OTP and errors
      setOtpValue("");
      setError("");

      // Log resend action
      console.log("Resending OTP...");

      // Here you would typically call your resend OTP API
      // const response = await resendOtpAction();

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast.success("Verification code sent successfully!");
      console.log("New OTP would be sent to user email");
    } catch (error) {
      // Handle resend errors
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-sm ">{t("verifyOtp.noEmail")}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] backdrop-blur-md rounded-2xl p-4 bg-white/10 shadow-2xl mx-auto border border-white/20">
      <div className="w-full bg-white/40 backdrop-blur-lg rounded-xl p-6 pt-10 flex flex-col gap-6">
        {/* OTP verification header with localized title and subtitle */}
        <div className="text-center">
          <p className="text-2xl font-semibold mb-2">{t("verifyOtp.title")}</p>
          <p className="text-neutral-50 font-medium">
            {t("verifyOtp.subtitle")}
          </p>
        </div>

        {/* OTP input section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-center">
              {t("verifyOtp.enterCode")}
            </label>

            {/* 6-digit OTP input using shadcn InputOTP component */}
            <InputOTP maxLength={6} value={otpValue} onChange={handleOtpChange}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot className="border-secondary border" index={0} />
                <InputOTPSlot className="border-secondary border" index={1} />
                <InputOTPSlot className="border-secondary border" index={2} />
                <InputOTPSlot className="border-secondary border" index={3} />
                <InputOTPSlot className="border-secondary border" index={4} />
                <InputOTPSlot className="border-secondary border" index={5} />
              </InputOTPGroup>
            </InputOTP>

            {/* Helper text for OTP input */}
            <p className="text-xs text-neutral-60 text-center">
              {t("verifyOtp.codeLength")}
            </p>
          </div>

          {/* Error message display */}
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
        </div>

        {/* Verify button with loading state */}
        <Button
          onClick={handleVerifyOtp}
          disabled={isPending || otpValue.length !== 6}
          className="w-full"
        >
          {isPending ? <SpinIcon /> : t("verifyOtp.verifyButton")}
        </Button>

        {/* Resend code section */}
        <div className="text-center">
          <p className="text-sm text-neutral-60 mb-2">
            {t("verifyOtp.resendCode")}
          </p>
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-secondary-50 text-sm hover:underline disabled:opacity-50"
          >
            {isResending ? <SpinIcon /> : t("verifyOtp.resendLink")}
          </button>
        </div>

        {/* Divider */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 border-t border-neutral-30" />
          <div className="flex-1 border-t border-neutral-30" />
        </div>

        {/* Back to login link */}
        <div className="text-center">
          <Link
            href={Routes.LOGIN}
            className="text-primary-50 text-sm hover:underline font-semibold"
          >
            {t("verifyOtp.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
