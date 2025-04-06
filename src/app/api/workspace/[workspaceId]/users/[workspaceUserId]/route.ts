import { NextRequest, NextResponse } from "next/server";
import { createPureClient } from "@/lib/supabase/server";
import { decodeAuthToken } from "@/app/api/_utils";

/**
 * 워크스페이스에서 팀원을 제거합니다.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; workspaceUserId: string } }
) {
  try {
    // 인증 처리
    let userId;
    try {
      const decoded = decodeAuthToken(request);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: "인증되지 않은 요청입니다." },
        { status: 401 }
      );
    }

    const workspaceId = parseInt(params.workspaceId);
    const workspaceUserId = parseInt(params.workspaceUserId);

    // Supabase 클라이언트 생성
    const supabase = await createPureClient();

    // 워크스페이스 소유자인지 확인 (소유자만 팀원 제거 가능)
    const { data: ownerCheck } = await supabase
      .from("workspace_user")
      .select("id")
      .eq("workspaceId", workspaceId)
      .eq("userId", userId)
      .eq("role", "owner")
      .single();

    if (!ownerCheck) {
      return NextResponse.json(
        { error: "팀원을 제거할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 삭제할 팀원이 존재하는지 확인
    const { data: targetMember, error: targetError } = await supabase
      .from("workspace_user")
      .select("id, userId")
      .eq("id", workspaceUserId)
      .eq("workspaceId", workspaceId)
      .single();

    if (targetError || !targetMember) {
      return NextResponse.json(
        { error: "해당 팀원을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 자기 자신(소유자)은 제거할 수 없음
    if (targetMember.userId === userId) {
      return NextResponse.json(
        { error: "소유자는 자신을 제거할 수 없습니다." },
        { status: 400 }
      );
    }

    // 팀원 제거
    const { error: deleteError } = await supabase
      .from("workspace_user")
      .delete()
      .eq("id", workspaceUserId)
      .eq("workspaceId", workspaceId);

    if (deleteError) {
      console.error("팀원 제거 오류:", deleteError);
      return NextResponse.json(
        { error: "팀원 제거에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("워크스페이스 팀원 제거 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
