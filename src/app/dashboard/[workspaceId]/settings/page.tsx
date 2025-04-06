import { createMainServerClient } from "@/lib/remote/main/server";
import { Tables } from "@/lib/supabase/types_db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkspaceSettingsForm } from "../../../../features/workspace/components/workspace-settings-form";

export const metadata: Metadata = {
  title: "워크스페이스 설정",
  description: "워크스페이스 설정을 관리합니다",
};

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const apiClient = await createMainServerClient();
  const workspace = await apiClient.get<Tables<"workspace">>(
    `/workspace/${workspaceId}`
  );

  if (!workspace) {
    return notFound();
  }

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">워크스페이스 설정</h1>
        <WorkspaceSettingsForm initialData={workspace} />
      </div>
    </div>
  );
}
