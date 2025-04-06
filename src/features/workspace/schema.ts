import { z } from "zod";
import { userRoleEnum } from "@/constants/user-role";

// 팀원 목록 조회 응답 스키마
export const workspaceUserListResponseSchema = z.array(
  z.object({
    id: z.number(),
    userId: z.number(),
    workspaceId: z.number(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(userRoleEnum),
    createdAt: z.string(),
  })
);

export type WorkspaceUserListResponse = z.infer<
  typeof workspaceUserListResponseSchema
>;

// 팀원 추가 요청 스키마
export const addWorkspaceUserSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  role: z.enum(userRoleEnum),
  workspaceId: z.number(),
});

export type AddWorkspaceUserRequest = z.infer<typeof addWorkspaceUserSchema>;

// 팀원 추가 응답 스키마
export const addWorkspaceUserResponseSchema = z.object({
  id: z.number(),
  workspaceId: z.number(),
  userId: z.number(),
  role: z.enum(userRoleEnum),
  createdAt: z.string(),
});

export type AddWorkspaceUserResponse = z.infer<
  typeof addWorkspaceUserResponseSchema
>;

// 팀원 삭제 요청 스키마
export const removeWorkspaceUserSchema = z.object({
  workspaceUserId: z.number(),
  workspaceId: z.number(),
});

export type RemoveWorkspaceUserRequest = z.infer<
  typeof removeWorkspaceUserSchema
>;

// 팀원 삭제 응답 스키마
export const removeWorkspaceUserResponseSchema = z.object({
  success: z.boolean(),
});

export type RemoveWorkspaceUserResponse = z.infer<
  typeof removeWorkspaceUserResponseSchema
>;
