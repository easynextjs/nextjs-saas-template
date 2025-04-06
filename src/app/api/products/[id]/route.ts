import { createPureClient } from "@/lib/supabase/server";
import {
  deleteProductSchema,
  updateProductSchema,
} from "@/features/product/schema";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const input = updateProductSchema.parse({
      ...body,
      id: params.id,
    });
    const supabase = await createPureClient();

    // 제품이 존재하는지 확인
    const { data: existingProduct, error: fetchError } = await supabase
      .from("product")
      .select("*")
      .eq("id", input.id)
      .eq("workspaceId", input.workspaceId)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: "제품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 제품 업데이트
    const { data, error } = await supabase
      .from("product")
      .update({
        name: input.name,
        price: input.price,
        imageUrl: input.imageUrl,
        status: input.status,
      })
      .eq("id", input.id)
      .eq("workspaceId", input.workspaceId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "제품 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId");

  try {
    const input = deleteProductSchema.parse({
      id: params.id,
      workspaceId,
    });
    const supabase = await createPureClient();

    // 제품이 존재하는지 확인
    const { data: existingProduct, error: fetchError } = await supabase
      .from("product")
      .select("*")
      .eq("id", input.id)
      .eq("workspaceId", input.workspaceId)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: "제품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 제품 삭제
    const { error } = await supabase
      .from("product")
      .delete()
      .eq("id", input.id)
      .eq("workspaceId", input.workspaceId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "제품 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
