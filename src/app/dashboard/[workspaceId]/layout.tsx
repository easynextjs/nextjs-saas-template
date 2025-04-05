import { DashboardTemplate } from "@/components/templates/dashboard";
import { createPureClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { WorkspaceProvider } from "./_workspace-provider";
import { createMainServerClient } from "@/lib/remote/main/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const apiClient = await createMainServerClient();
  const { hasPermission } = await apiClient.get<{
    hasPermission: boolean;
  }>(`/workspace/${workspaceId}/check-permission`);

  if (!hasPermission) {
    return notFound();
  }

  const supabase = await createPureClient();
  const { data: workspace, error } = await supabase
    .from("workspace")
    .select("*")
    .eq("id", Number(workspaceId))
    .single();

  if (error || !workspace) {
    return notFound();
  }

  return (
    <WorkspaceProvider workspace={workspace}>
      <DashboardTemplate>{children}</DashboardTemplate>
    </WorkspaceProvider>
  );
}
