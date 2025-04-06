export const userRoleEnum = ["owner", "guest"] as const;

export type UserRole = (typeof userRoleEnum)[number];

export const userRoleLabel: Record<UserRole, string> = {
  owner: "관리자",
  guest: "게스트",
};
