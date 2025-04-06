import { NextResponse } from "next/server";
import { UpdateProfileSchema } from "@/features/profile/schema";
import { createPureClient } from "@/lib/supabase/server";
import { decodeAuthToken } from "@/app/api/_utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const jwtPayload = decodeAuthToken(request);
    const userId = jwtPayload.userId;

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    const supabase = await createPureClient();

    // 이메일 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("user")
      .select("id")
      .eq("email", validatedData.email)
      .neq("id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        { message: "이메일 확인 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 사용 중인 이메일입니다" },
        { status: 400 }
      );
    }

    // 프로필 업데이트
    const { data, error } = await supabase
      .from("user")
      .update({
        name: validatedData.name,
        email: validatedData.email,
      })
      .eq("id", userId)
      .select("id, name, email, lastLoginAt, createdAt, updatedAt")
      .single();

    if (error) {
      return NextResponse.json(
        { message: "프로필 업데이트에 실패했습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "요청 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
