import "server-only";

import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants/cookie-name";

export async function checkAccessToken() {
  const token = await getCookie(COOKIE_NAME.ACCESS_TOKEN, { cookies });

  return token !== undefined;
}
