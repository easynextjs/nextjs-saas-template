import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createPureClient } from "@/lib/supabase/server";
import { loginPayloadSchema } from "@/features/auth/schema";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedBody = loginPayloadSchema.parse(body);
    const { email, password } = validatedBody;

    const supabase = await createPureClient();
    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || !users || users.length === 0) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 로그인 시간 업데이트
    await supabase
      .from("user")
      .update({ lastLoginAt: new Date().toISOString() })
      .eq("id", user.id);

    // JWT 토큰 생성
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        data: {
          accessToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
