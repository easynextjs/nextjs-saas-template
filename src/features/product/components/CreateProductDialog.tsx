"use client";

import { useState } from "react";
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
import { useCreateProduct } from "../queries/useProducts";
import {
  CreateProductInput,
  createProductSchema,
  productStatusEnum,
} from "../schema";
import { useWorkspace } from "@/providers/dashboard";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const workspace = useWorkspace();
  const { mutate, isPending } = useCreateProduct();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      workspaceId: workspace.id,
      status: "in_ready",
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>새 제품 추가</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>제품 추가</DialogTitle>
          <DialogDescription>
            새로운 제품을 추가합니다. 필수 정보를 입력해주세요.
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
                  defaultValue="in_ready"
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
              {isPending ? "등록 중..." : "제품 등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
