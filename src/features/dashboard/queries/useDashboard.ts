import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../api";
import { DashboardData } from "../schema";

/**
 * 워크스페이스의 대시보드 데이터를 가져오는 쿼리 훅
 * @param workspaceId 워크스페이스 ID
 * @returns 대시보드 데이터 쿼리 결과
 */
export const useDashboardData = (workspaceId: number | string) => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", workspaceId],
    queryFn: () => getDashboardData(workspaceId),
    enabled: !!workspaceId,
  });
};
