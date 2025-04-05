import { createMainServerClient } from "@/lib/remote/main/server";
import { Tables } from "@/lib/supabase/types_db";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const apiClient = await createMainServerClient();
  const workspace = await apiClient
    .get<Tables<"workspace">>("/me/workspace")
    .catch((err) => {
      console.error(err);
      redirect("/auth/login");
    });

  if (workspace) {
    redirect(`/dashboard/${workspace.id}`);
  } else if (workspace === null) {
    return notFound();
  }

  return <></>;
}
