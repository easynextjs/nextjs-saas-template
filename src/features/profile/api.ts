"use client";

import { UpdateProfileRequest, ProfileResponse } from "./schema";
import { createMainClient } from "@/lib/remote/main/client";

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<ProfileResponse> {
  return await createMainClient().post<ProfileResponse>(
    "/profile/update",
    data
  );
}
