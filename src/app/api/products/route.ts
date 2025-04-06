import { createPureClient } from "@/lib/supabase/server";
import {
  createProductSchema,
  getProductsSchema,
} from "@/features/product/schema";
import { NextResponse } from "next/server";
import { decodeAuthToken } from "@/app/api/_utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");

  try {
    const input = getProductsSchema.parse({ workspaceId });
    const supabase = await createPureClient();

    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("workspaceId", input.workspaceId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "제품 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = createProductSchema.parse(body);
    const supabase = await createPureClient();

    // decodeAuthToken을 사용하여 사용자 인증
    let userId;
    try {
      const decoded = decodeAuthToken(req);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 사용자가 존재하는지 확인
    const { data: userData } = await supabase
      .from("user")
      .select("id")
      .eq("id", userId)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 403 }
      );
    }

    // 사용자가 해당 워크스페이스에 접근 권한이 있는지 확인
    const { data: workspaceUser, error: workspaceError } = await supabase
      .from("workspace_user")
      .select("*")
      .eq("workspaceId", input.workspaceId)
      .eq("userId", userId)
      .single();

    if (workspaceError || !workspaceUser) {
      return NextResponse.json(
        { error: "이 워크스페이스에 접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 제품 생성
    const { data, error } = await supabase
      .from("product")
      .insert({
        name: input.name,
        price: input.price,
        imageUrl: input.imageUrl,
        status: input.status,
        workspaceId: input.workspaceId,
        createdUserId: userId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "제품 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
