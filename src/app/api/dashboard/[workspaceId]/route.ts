"use server";

import { decodeAuthToken } from "@/app/api/_utils";
import { createPureClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    // 인증 처리
    let userId;
    try {
      const decoded = decodeAuthToken(request);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: "인증 정보가 필요합니다." },
        { status: 401 }
      );
    }

    const { workspaceId } = await params;
    const supabase = await createPureClient();

    // 워크스페이스 접근 권한 확인
    const { data: memberCheck, error: memberError } = await supabase
      .from("workspace_user")
      .select("id")
      .eq("workspaceId", Number(workspaceId))
      .eq("userId", userId)
      .single();

    if (memberError || !memberCheck) {
      return NextResponse.json(
        { error: "워크스페이스에 접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 워크스페이스 정보 가져오기
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspace")
      .select("*")
      .eq("id", Number(workspaceId))
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: "워크스페이스를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 제품 통계 정보 가져오기
    const { data: products, error: productsError } = await supabase
      .from("product")
      .select("id, status")
      .eq("workspaceId", Number(workspaceId));

    if (productsError) {
      return NextResponse.json(
        { error: "제품 정보를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 멤버 목록 가져오기
    const { data: members, error: membersError } = await supabase
      .from("workspace_user")
      .select(
        `
        id, 
        userId,
        workspaceId,
        role,
        createdAt,
        user:userId (
          id,
          name,
          email
        )
      `
      )
      .eq("workspaceId", Number(workspaceId))
      .order("createdAt", { ascending: false });

    if (membersError) {
      return NextResponse.json(
        { error: "멤버 정보를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 최근 추가된 제품 가져오기
    const { data: recentProducts, error: recentProductsError } = await supabase
      .from("product")
      .select("*")
      .eq("workspaceId", Number(workspaceId))
      .order("createdAt", { ascending: false })
      .limit(5);

    if (recentProductsError) {
      return NextResponse.json(
        { error: "최근 제품 정보를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 제품 상태별 통계 계산
    const totalProducts = products.length;
    const saleProducts = products.filter(
      (product) => product.status === "sale"
    ).length;
    const soldoutProducts = products.filter(
      (product) => product.status === "soldout"
    ).length;
    const inReadyProducts = products.filter(
      (product) => product.status === "in_ready"
    ).length;
    const stopProducts = products.filter(
      (product) => product.status === "stop"
    ).length;

    return NextResponse.json({
      data: {
        summary: {
          workspace,
          stats: {
            totalProducts,
            saleProducts,
            soldoutProducts,
            inReadyProducts,
            stopProducts,
            totalMembers: members.length,
          },
        },
        members,
        recentProducts,
      },
    });
  } catch (error) {
    console.error("대시보드 데이터 가져오기 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
