"use client";

import { RecentProduct } from "../schema";
import { cn } from "@/lib/utils";
import { formatToKRW } from "@toss/utils";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  getStatusColor,
  getStatusText,
} from "@/features/product/components/ProductsTable";
import Link from "next/link";
import { useWorkspace } from "@/providers/dashboard";
import { ChevronRight } from "lucide-react";

type RecentProductsProps = {
  products: RecentProduct[];
};

export function RecentProducts({ products }: RecentProductsProps) {
  const workspace = useWorkspace();

  return (
    <div
      className={cn(
        "rounded-xl bg-white dark:bg-neutral-800",
        "border border-neutral-100/80 dark:border-neutral-700/50",
        "shadow-sm p-6 flex flex-col",
        "transition-all duration-300"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">최근 제품</h2>
        <Link
          href={`/dashboard/${workspace.id}/products`}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <span>모든 제품 보기</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                  이미지 없음
                </div>
              )}
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-neutral-500">
                  {formatToKRW(product.price)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                  product.status
                )}`}
              >
                {getStatusText(product.status)}
              </span>
              <span className="text-xs text-neutral-500">
                {formatDistanceToNow(new Date(product.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            등록된 제품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
