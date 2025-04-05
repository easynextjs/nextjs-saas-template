import { DashboardTemplate } from "@/components/templates/dashboard";
import { createPureClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { createMainServerClient } from "@/lib/remote/main/server";
import { checkAccessToken } from "@/lib/server/hasAccessToken";
import { Tables } from "@/lib/supabase/types_db";
import { DashboardProvider } from "@/providers/dashboard";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const hasAccessToken = await checkAccessToken();

  if (!hasAccessToken) {
    console.log("no access token");
    return redirect("/auth/login");
  }

  const apiClient = await createMainServerClient();
  const { hasPermission } = await apiClient.get<{
    hasPermission: boolean;
  }>(`/workspace/${workspaceId}/check-permission`);

  if (!hasPermission) {
    return notFound();
  }

  const user = await apiClient.get<Tables<"user">>("/me");

  if (!user) {
    console.log("no user");
    return redirect("/auth/login");
  }

  const supabase = await createPureClient();
  const { data: workspace } = await supabase
    .from("workspace")
    .select("*")
    .eq("id", Number(workspaceId))
    .single();

  if (!workspace) {
    console.log("no workspace");
    return redirect("/auth/login");
  }

  return (
    <DashboardProvider workspace={workspace} user={user}>
      <DashboardTemplate>{children}</DashboardTemplate>
    </DashboardProvider>
  );
}
