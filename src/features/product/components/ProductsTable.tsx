"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteProduct, useProducts } from "../queries/useProducts";
import { useWorkspace } from "@/providers/dashboard";
import { UpdateProductDialog } from "./UpdateProductDialog";
import { formatToKRW } from "@toss/utils";
import { Product } from "../api";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function getStatusText(status: string) {
  switch (status) {
    case "in_ready":
      return "준비 중";
    case "sale":
      return "판매 중";
    case "soldout":
      return "품절";
    case "stop":
      return "판매 중지";
    default:
      return "알 수 없음";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "in_ready":
      return "bg-yellow-100 text-yellow-800";
    case "sale":
      return "bg-green-100 text-green-800";
    case "soldout":
      return "bg-red-100 text-red-800";
    case "stop":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function ProductsTable() {
  const workspace = useWorkspace();
  const { data: products, isLoading, isError } = useProducts(workspace.id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    return [...products].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [products]);

  const handleDelete = (product: Product) => {
    if (window.confirm(`정말로 "${product.name}" 제품을 삭제하시겠습니까?`)) {
      deleteProduct({
        id: product.id,
        workspaceId: workspace.id,
      });
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">로딩 중...</div>;
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-red-500">
        제품 목록을 불러오는데 실패했습니다.
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="py-8 text-center">등록된 제품이 없습니다.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제품명</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>마지막 업데이트</TableHead>
            <TableHead className="w-[100px]">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                      이미지 없음
                    </div>
                  )}
                  <span>{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{formatToKRW(product.price)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}
                >
                  {getStatusText(product.status)}
                </span>
              </TableCell>
              <TableCell>
                {new Date(product.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">메뉴 열기</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>작업</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <UpdateProductDialog
                      product={product}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>수정</span>
                        </DropdownMenuItem>
                      }
                    />
                    <DropdownMenuItem onClick={() => handleDelete(product)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
