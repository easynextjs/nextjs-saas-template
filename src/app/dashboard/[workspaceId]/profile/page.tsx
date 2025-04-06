import { Suspense } from "react";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { AdminPageTemplate } from "@/components/templates/admin-page";

export default async function Page() {
  return (
    <AdminPageTemplate title="내 프로필">
      <Suspense fallback={<div>로딩 중...</div>}>
        <ProfilePage />
      </Suspense>
    </AdminPageTemplate>
  );
}
