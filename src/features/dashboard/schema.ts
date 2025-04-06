import { z } from "zod";

// 대시보드 요약 정보 스키마
export const dashboardSummarySchema = z.object({
  workspace: z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  stats: z.object({
    totalProducts: z.number(),
    saleProducts: z.number(),
    soldoutProducts: z.number(),
    inReadyProducts: z.number(),
    stopProducts: z.number(),
    totalMembers: z.number(),
  }),
});

// 멤버 목록 스키마
export const workspaceMemberSchema = z.object({
  id: z.number(),
  userId: z.number(),
  workspaceId: z.number(),
  role: z.enum(["owner", "guest"]),
  createdAt: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }),
});

export const workspaceMembersSchema = z.array(workspaceMemberSchema);

// 최근 제품 목록 스키마
export const recentProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  status: z.enum(["in_ready", "sale", "soldout", "stop"]),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const recentProductsSchema = z.array(recentProductSchema);

// API 응답 스키마
export const dashboardDataSchema = z.object({
  summary: dashboardSummarySchema,
  members: workspaceMembersSchema,
  recentProducts: recentProductsSchema,
});

// 타입 정의
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;
export type RecentProduct = z.infer<typeof recentProductSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
