"use client";

import { Tables } from "@/lib/supabase/types_db";
import { createContext, useContext } from "react";

type WorkspaceContextType = {
  workspace: Tables<"workspace">;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: null,
});
export function useWorkspace() {
  const { workspace } = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("WorkspaceContext not found");
  }

  return workspace;
}

export function WorkspaceProvider({
  workspace,
  children,
}: {
  workspace: Tables<"workspace">;
  children: React.ReactNode;
}) {
  return (
    <WorkspaceContext.Provider value={{ workspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
