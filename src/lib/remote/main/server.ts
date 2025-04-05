import "server-only";

import { createApiClient } from "../createApiClient";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants/cookie-name";

export const createMainServerClient = async () => {
  const token = await getCookie(COOKIE_NAME.ACCESS_TOKEN, { cookies });

  console.log(token);

  return createApiClient(`${process.env.NEXT_PUBLIC_URL}/api`).bearerAuth(
    token as string
  );
};
