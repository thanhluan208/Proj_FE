"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name)?.value;

  return cookie || "";
}

export async function setCookie(
  name: string,
  value: string,
  maxAge = 60 * 60 * 24
) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    maxAge,
  });
}

export async function removeCookie(name: string) {
  const cookieStore = await cookies();

  return cookieStore.delete(name);
}
