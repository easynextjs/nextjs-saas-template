"use client";

import { UpdateProfileRequest, ProfileResponse } from "./schema";

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<ProfileResponse> {
  const response = await fetch("/api/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "프로필 업데이트에 실패했습니다");
  }

  const result = await response.json();
  return result.data;
}
