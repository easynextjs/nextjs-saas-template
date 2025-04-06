import { z } from "zod";

export const productStatusEnum = z.enum([
  "in_ready",
  "sale",
  "soldout",
  "stop",
]);

export type ProductStatus = z.infer<typeof productStatusEnum>;

export const createProductSchema = z.object({
  name: z.string().min(1, "제품명은 필수입니다."),
  price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다."),
  imageUrl: z.string().optional(),
  status: productStatusEnum.default("in_ready"),
  workspaceId: z.coerce.number(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1, "제품명은 필수입니다."),
  price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다."),
  imageUrl: z.string().optional(),
  status: productStatusEnum,
  workspaceId: z.coerce.number(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const deleteProductSchema = z.object({
  id: z.coerce.number(),
  workspaceId: z.coerce.number(),
});

export type DeleteProductInput = z.infer<typeof deleteProductSchema>;

export const getProductsSchema = z.object({
  workspaceId: z.coerce.number(),
});

export type GetProductsInput = z.infer<typeof getProductsSchema>;
