"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constant";
import { decodeJwtPayload } from "@/lib/utils";
import { CommonResponse } from "@/types";
import {
  LoginPayload,
  LoginResponse,
  Profile,
  RefreshResponse,
  RegisterPayload,
  UserDataLogin,
  VerifyOtpPayload,
} from "@/types/authentication.type";

import { apiUtils } from "./helper";

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export const baseLoginAction = apiUtils.createServerAction<
  LoginPayload,
  LoginResponse
>("/auth/email/login", "POST");

export const loginAction = async (
  payload: LoginPayload
): Promise<CommonResponse<null>> => {
  try {
    // Call the API
    const response = await baseLoginAction(payload);

    if (response.error || !response.data) {
      return {
        status: response.status || 500,
        message: response?.message || "Login failed",
      };
    }

    const { refreshExpires, refreshToken, token, tokenExpires } = response.data;

    // Validate that we received the required tokens
    if (!token || !refreshToken) {
      return {
        status: response.status || 500,
        message: response?.message || "Login failed",
      };
    }

    // Set cookies
    const cookieStore = await cookies();

    // Set access token (shorter expiry)
    cookieStore.set(ACCESS_TOKEN, token, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + tokenExpires),
    });

    // Set refresh token (longer expiry)
    cookieStore.set(REFRESH_TOKEN, refreshToken, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + refreshExpires),
    });

    // Return success response (without tokens for security)
    return {
      message: response.message || "Login successful",
      status: response.status || 200,
    };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      status: 500,
    };
  }
};

export const registerAction = apiUtils.createServerAction<
  RegisterPayload,
  CommonResponse<null>
>("/auth/email/register", "POST");

export const verifyOtpAction = apiUtils.createServerAction<
  VerifyOtpPayload,
  CommonResponse<null>
>("/auth/email/confirm", "POST");

export const refreshTokenAction = apiUtils.createServerAction<
  {},
  RefreshResponse
>("/auth/refresh", "POST", {
  refreshAuth: true,
});

export const getUserData = async () => {
  return apiUtils.createServerFetcher<Profile>("/user/profile")({
    next: {
      tags: ["profile"],
    },
  });
};

export const baseLogoutAction = apiUtils.createServerAction<
  {},
  CommonResponse<null>
>("/auth/logout", "POST");

export const logoutAction = async () => {
  try {
    // Call the API
    await baseLogoutAction({});
  } catch (error) {
    console.error("Logout API error:", error);
    // We continue to clear cookies even if API fails
  }

  // Clear cookies
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);

  // Redirect to login
  redirect("/login");
};
