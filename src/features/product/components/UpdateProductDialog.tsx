"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProduct } from "../queries/useProducts";
import { UpdateProductInput, updateProductSchema } from "../schema";
import { useWorkspace } from "@/providers/dashboard";
import { Product } from "../api";

interface UpdateProductDialogProps {
  product: Product;
  trigger: React.ReactNode;
}

export function UpdateProductDialog({
  product,
  trigger,
}: UpdateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const workspace = useWorkspace();
  const { mutate, isPending } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "",
      status: product.status,
      workspaceId: workspace.id,
    },
  });

  // 제품 정보가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    reset({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "",
      status: product.status,
      workspaceId: workspace.id,
    });
  }, [product, workspace.id, reset]);

  const onSubmit = (data: UpdateProductInput) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>제품 수정</DialogTitle>
          <DialogDescription>
            제품 정보를 수정합니다. 수정할 내용을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                제품명
              </label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="제품명을 입력하세요"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right">
                가격
              </label>
              <div className="col-span-3">
                <Input
                  id="price"
                  type="number"
                  placeholder="가격을 입력하세요"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="imageUrl" className="text-right">
                이미지 URL
              </label>
              <div className="col-span-3">
                <Input
                  id="imageUrl"
                  placeholder="이미지 URL을 입력하세요 (선택사항)"
                  {...register("imageUrl")}
                />
                {errors.imageUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                상태
              </label>
              <div className="col-span-3">
                <Select
                  defaultValue={product.status}
                  onValueChange={(value) => setValue("status", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_ready">준비 중</SelectItem>
                    <SelectItem value="sale">판매 중</SelectItem>
                    <SelectItem value="soldout">품절</SelectItem>
                    <SelectItem value="stop">판매 중지</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
