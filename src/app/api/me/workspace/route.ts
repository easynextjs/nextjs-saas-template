import { decodeAuthToken } from "@/app/api/_utils";
import { createPureClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const jwtPayload = decodeAuthToken(request);

  const supabase = await createPureClient();
  const { data: workspace, error } = await supabase
    .from("workspace")
    .select("*")
    .eq("userId", jwtPayload.userId)
    .single();

  if (error || !workspace) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: workspace });
}
