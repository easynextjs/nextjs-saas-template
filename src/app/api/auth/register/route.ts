import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createPureClient } from "@/lib/supabase/server";
import { registerPayloadSchema } from "@/features/auth/schema";
import { createAuthToken } from "../../_utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedBody = registerPayloadSchema.parse(body);
    const { email, password, name } = validatedBody;

    const supabase = await createPureClient();

    // 이미 존재하는 이메일인지 확인
    const { data: existingUsers } = await supabase
      .from("user")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 사용자 생성
    const { data: newUser, error: createError } = await supabase
      .from("user")
      .insert([
        {
          email,
          passwordHash,
          passwordSalt: salt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (createError || !newUser) {
      console.error("User creation error:", createError);
      return NextResponse.json(
        { error: "회원가입 처리 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 기본 워크스페이스 생성
    const { error: workspaceError } = await supabase.from("workspace").insert([
      {
        name: `${name}'s Workspace`,
        userId: newUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    if (workspaceError) {
      console.error("Workspace creation error:", workspaceError);
      // 워크스페이스 생성 실패해도 회원가입은 완료로 처리
    }

    // JWT 토큰 생성
    const accessToken = createAuthToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return NextResponse.json(
      {
        data: {
          accessToken,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
