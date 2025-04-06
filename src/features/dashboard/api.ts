import { createMainClient } from "@/lib/remote/main/client";
import { DashboardData } from "./schema";

/**
 * 워크스페이스의 대시보드 데이터를 가져옵니다.
 * @param workspaceId 워크스페이스 ID
 * @returns 대시보드 데이터
 */
export const getDashboardData = async (
  workspaceId: number | string
): Promise<DashboardData> => {
  const client = createMainClient();
  return await client.get<DashboardData>(`/dashboard/${workspaceId}`);
};
