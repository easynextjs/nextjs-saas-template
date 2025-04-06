"use client";

import { AdminPageTemplate } from "@/components/templates/admin-page";
import { DashboardStats } from "../components/DashboardStats";
import { MembersList } from "../components/MembersList";
import { RecentProducts } from "../components/RecentProducts";
import { useWorkspace } from "@/providers/dashboard";
import { useDashboardData } from "../queries/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { match } from "ts-pattern";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function DashboardPage() {
  const workspace = useWorkspace();
  const { data, isLoading, isError } = useDashboardData(workspace.id);

  return (
    <AdminPageTemplate title="대시보드">
      {match({ isLoading, isError, data })
        .with({ isLoading: true }, () => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </>
        ))
        .with({ isError: true }, () => (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>
              대시보드 데이터를 불러오는 중 오류가 발생했습니다.
              <button
                className="ml-2 underline"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </AlertDescription>
          </Alert>
        ))
        .otherwise(() => (
          <>
            {data && (
              <>
                <DashboardStats summary={data.summary} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <MembersList members={data.members} />
                  <RecentProducts products={data.recentProducts} />
                </div>
              </>
            )}
          </>
        ))}
    </AdminPageTemplate>
  );
}
