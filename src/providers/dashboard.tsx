"use client";

import { Tables } from "@/lib/supabase/types_db";
import { createContext, useContext } from "react";

type DashboardContextType = {
  workspace: Tables<"workspace">;
  user: Tables<"user">;
};

const DashboardContext = createContext<DashboardContextType>({
  workspace: null,
  user: null,
});
export function useWorkspace() {
  const { workspace } = useContext(DashboardContext);
  if (!workspace) {
    throw new Error("DashboardContext not found");
  }

  return workspace;
}

export function useUser() {
  const { user } = useContext(DashboardContext);
  if (!user) {
    throw new Error("DashboardContext not found");
  }

  return user;
}

export function DashboardProvider({
  workspace,
  user,
  children,
}: {
  workspace: Tables<"workspace">;
  user: Tables<"user">;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ workspace, user }}>
      {children}
    </DashboardContext.Provider>
  );
}
