import { decodeAuthToken } from "@/app/api/_utils";
import { createPureClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 워크스페이스 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  try {
    const jwtPayload = decodeAuthToken(request);

    const supabase = await createPureClient();

    // 워크스페이스 접근 권한 확인
    const { data: workspaceUser } = await supabase
      .from("workspace_user")
      .select("*")
      .eq("workspaceId", Number(workspaceId))
      .eq("userId", jwtPayload.userId);

    if (!workspaceUser?.length) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 워크스페이스 정보 조회
    const { data: workspace, error } = await supabase
      .from("workspace")
      .select("*")
      .eq("id", Number(workspaceId))
      .single();

    if (error || !workspace) {
      return NextResponse.json(
        { error: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: workspace });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 워크스페이스 정보 업데이트 스키마
const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "워크스페이스 이름은 필수입니다."),
});

// 워크스페이스 정보 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  try {
    const jwtPayload = decodeAuthToken(request);
    const body = await request.json();

    // 요청 데이터 검증
    const validatedData = updateWorkspaceSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    const supabase = await createPureClient();

    // 워크스페이스 접근 권한 확인
    const { data: workspaceUser } = await supabase
      .from("workspace_user")
      .select("role")
      .eq("workspaceId", Number(workspaceId))
      .eq("userId", jwtPayload.userId);

    if (!workspaceUser?.length) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 워크스페이스 정보 업데이트
    const { data: updatedWorkspace, error } = await supabase
      .from("workspace")
      .update({ name: validatedData.data.name })
      .eq("id", Number(workspaceId))
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "워크스페이스 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updatedWorkspace });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
