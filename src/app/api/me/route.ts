import { decodeAuthToken } from "@/app/api/_utils";
import { createPureClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const jwtPayload = decodeAuthToken(request);

  const supabase = await createPureClient();
  const { data: user, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", jwtPayload.userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: user });
}
