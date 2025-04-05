import { COOKIE_NAME } from "@/constants/cookie-name";
import { createApiClient } from "../createApiClient";
import { getCookie } from "cookies-next/client";

export const createMainClient = () =>
  createApiClient(`${process.env.NEXT_PUBLIC_URL}/api`).bearerAuth(
    getCookie(COOKIE_NAME.ACCESS_TOKEN) || ""
  );
