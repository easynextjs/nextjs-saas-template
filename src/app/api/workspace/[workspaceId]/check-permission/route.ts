import { decodeAuthToken } from "@/app/api/_utils";
import { createPureClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  const jwtPayload = decodeAuthToken(request);

  const supabase = await createPureClient();
  const { data: workspaceUser, error } = await supabase
    .from("workspace_user")
    .select("*")
    .eq("workspaceId", Number(workspaceId))
    .eq("userId", jwtPayload.userId);

  if (error || !workspaceUser) {
    return NextResponse.json({ data: { hasPermission: false } });
  }

  return NextResponse.json({ data: { hasPermission: true } });
}
