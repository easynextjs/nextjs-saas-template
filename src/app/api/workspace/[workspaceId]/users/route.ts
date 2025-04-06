import { NextRequest, NextResponse } from "next/server";
import { createPureClient } from "@/lib/supabase/server";
import { addWorkspaceUserSchema } from "@/features/workspace/schema";
import { decodeAuthToken } from "@/app/api/_utils";

/**
 * 워크스페이스의 팀원 목록을 조회합니다.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
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

    // Supabase 클라이언트 생성
    const supabase = await createPureClient();

    // 워크스페이스 접근 권한 체크
    const { data: permissionCheck } = await supabase
      .from("workspace_user")
      .select("id")
      .eq("workspaceId", workspaceId)
      .eq("userId", userId)
      .single();

    if (!permissionCheck) {
      return NextResponse.json(
        { error: "워크스페이스에 접근할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 팀원 목록 조회 (유저 정보 포함)
    const { data: teamMembers, error } = await supabase
      .from("workspace_user")
      .select(
        `
        id,
        userId,
        workspaceId,
        role,
        createdAt,
        user:userId (
          name,
          email
        )
      `
      )
      .eq("workspaceId", workspaceId);

    if (error) {
      console.error("팀원 목록 조회 오류:", error);
      return NextResponse.json(
        { error: "팀원 목록을 조회하는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 응답 데이터 형식에 맞게 변환
    const formattedMembers = teamMembers.map((member) => ({
      id: member.id,
      userId: member.userId,
      workspaceId: member.workspaceId,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      createdAt: member.createdAt,
    }));

    return NextResponse.json({ data: formattedMembers });
  } catch (error) {
    console.error("워크스페이스 팀원 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 워크스페이스에 새 팀원을 추가합니다.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
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

    // Supabase 클라이언트 생성
    const supabase = await createPureClient();

    // 워크스페이스 소유자인지 확인 (소유자만 팀원 추가 가능)
    const { data: ownerCheck } = await supabase
      .from("workspace_user")
      .select("id")
      .eq("workspaceId", workspaceId)
      .eq("userId", userId)
      .eq("role", "owner")
      .single();

    if (!ownerCheck) {
      return NextResponse.json(
        { error: "팀원을 추가할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 요청 데이터 검증
    const body = await request.json();
    const validationResult = addWorkspaceUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "잘못된 요청 형식입니다.",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, role } = validationResult.data;

    // 이메일로 사용자 검색
    const { data: userToAdd, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userToAdd) {
      return NextResponse.json(
        { error: "해당 이메일의 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 팀원으로 등록되어 있는지 확인
    const { data: existingMember } = await supabase
      .from("workspace_user")
      .select("id")
      .eq("workspaceId", workspaceId)
      .eq("userId", userToAdd.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "이미 등록된 팀원입니다." },
        { status: 409 }
      );
    }

    // 팀원 추가
    const { data: newMember, error: insertError } = await supabase
      .from("workspace_user")
      .insert({
        workspaceId,
        userId: userToAdd.id,
        role,
      })
      .select("id, workspaceId, userId, role, createdAt")
      .single();

    if (insertError) {
      console.error("팀원 추가 오류:", insertError);
      return NextResponse.json(
        { error: "팀원 추가에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: newMember });
  } catch (error) {
    console.error("워크스페이스 팀원 추가 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
