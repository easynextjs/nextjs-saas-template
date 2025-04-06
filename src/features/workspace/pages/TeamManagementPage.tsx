"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { UserTeamList } from "../components/UserTeamList";
import { AddTeamMemberForm } from "../components/AddTeamMemberForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminPageTemplate } from "@/components/templates/admin-page";

export function TeamManagementPage() {
  const params = useParams();
  const workspaceId = Number(params.workspaceId);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMemberAdded = () => {
    // 팀원 목록 갱신을 위한 트리거
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleMemberRemoved = () => {
    // 팀원 목록 갱신을 위한 트리거
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminPageTemplate title="팀 관리">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>팀원 목록</CardTitle>
                <CardDescription>
                  워크스페이스에 등록된 팀원 목록입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTeamList
                  workspaceId={workspaceId}
                  refreshTrigger={refreshTrigger}
                  onMemberRemoved={handleMemberRemoved}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>팀원 추가</CardTitle>
                <CardDescription>
                  이메일로 새 팀원을 초대합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddTeamMemberForm
                  workspaceId={workspaceId}
                  onMemberAdded={handleMemberAdded}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminPageTemplate>
  );
}
