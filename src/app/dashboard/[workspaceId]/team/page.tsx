import { Suspense } from "react";
import { TeamManagementPage } from "@/features/workspace/pages/TeamManagementPage";

export default async function TeamPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <TeamManagementPage />
    </Suspense>
  );
}
