"use server";

import { apiUtils } from "./helper";
import { Profile } from "@/types/authentication.type";
import { CommonResponse } from "@/types";
import { updateTag } from "next/cache";

export interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export const updateProfileAction = apiUtils.createServerAction<
  UpdateProfilePayload,
  CommonResponse<Profile>
>("/user/profile", "PATCH");

export const updateProfile = async (data?: UpdateProfilePayload) => {
  const response = await updateProfileAction(data);
  updateTag("profile");

  return response;
};
