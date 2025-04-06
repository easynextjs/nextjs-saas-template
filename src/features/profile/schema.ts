import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

export const ProfileResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  lastLoginAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
